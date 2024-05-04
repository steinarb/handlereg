/*
 * Copyright 2018-2024 Steinar Bang
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations
 * under the License.
 */
package no.priv.bang.handlereg.backend;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Month;
import java.time.Year;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.sql.DataSource;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.log.LogService;
import org.osgi.service.log.Logger;

import no.priv.bang.handlereg.services.Butikk;
import no.priv.bang.handlereg.services.ButikkCount;
import no.priv.bang.handlereg.services.ButikkDate;
import no.priv.bang.handlereg.services.ButikkSum;
import no.priv.bang.handlereg.services.Favoritt;
import no.priv.bang.handlereg.services.NyFavoritt;
import no.priv.bang.handlereg.services.Favorittpar;
import no.priv.bang.handlereg.services.HandleregException;
import no.priv.bang.handlereg.services.HandleregService;
import no.priv.bang.handlereg.services.NyHandling;
import no.priv.bang.handlereg.services.Oversikt;
import no.priv.bang.handlereg.services.SumYear;
import no.priv.bang.handlereg.services.SumYearMonth;
import no.priv.bang.handlereg.services.Transaction;
import no.priv.bang.osgiservice.users.Role;
import no.priv.bang.osgiservice.users.UserManagementService;
import static no.priv.bang.handlereg.services.HandleregConstants.*;

@Component(service=HandleregService.class, immediate=true)
public class HandleregServiceProvider implements HandleregService {

    private Logger logger;
    private DataSource datasource;
    private UserManagementService useradmin;

    @Reference
    public void setLogservice(LogService logservice) {
        this.logger = logservice.getLogger(HandleregServiceProvider.class);
    }

    @Reference(target = "(osgi.jndi.service.name=jdbc/handlereg)")
    public void setDatasource(DataSource datasource) {
        this.datasource = datasource;
    }

    @Reference
    public void setUseradmin(UserManagementService useradmin) {
        this.useradmin = useradmin;
    }

    @Activate
    public void activate() {
        addRolesIfNotpresent();
    }

    @Override
    public Oversikt finnOversikt(String brukernavn) {
        var sql = "select a.account_id, a.username, (select sum(t1.transaction_amount) from transactions t1 where t1.account_id=a.account_id) - (select sum(t1.transaction_amount) from transactions t1 where t1.account_id!=a.account_id) as balance from accounts a where a.username=?";
        try(var connection = datasource.getConnection()) {
            var sumPreviousMonth = 0.0;
            var sumThisMonth = 0.0;
            // We want the two last items of the resultset, but it's not possible to
            // order a view in SQL, so this can't be done in SQL.
            //
            // Therefore we have to iterate backwards through the resultset.
            try (var statement = connection.prepareStatement(
                     "select * from sum_over_month_view",
                     ResultSet.TYPE_SCROLL_INSENSITIVE,
                     ResultSet.CONCUR_READ_ONLY))
            {
                try (var results = statement.executeQuery()) {
                    if (results.last()) {
                        sumThisMonth = results.getDouble(1);
                    }
                    if (results.previous()) {
                        sumPreviousMonth = results.getDouble(1);
                    }
                }
            }

            double lastTransactionAmount = 0;
            var lastTransactionStore = -1;
            var lastTransactionAmountQuery = "select transaction_amount, store_id from transactions t join accounts a on t.account_id=a.account_id where a.username=? order by transaction_time desc fetch first 1 rows only";
            try (var statement = connection.prepareStatement(lastTransactionAmountQuery)) {
                statement.setString(1, brukernavn);
                try(var results = statement.executeQuery()) {
                    if (results.next()) {
                        lastTransactionAmount = results.getDouble(1);
                        lastTransactionStore = results.getInt(2);
                    }
                }
            }

            try (var statement = connection.prepareStatement(sql)) {
                statement.setString(1, brukernavn);
                try(var results = statement.executeQuery()) {
                    if (results.next()) {
                        var userid = results.getInt(1);
                        var username = results.getString(2);
                        var balanse = results.getDouble(3);
                        var user = useradmin.getUser(username);
                        return Oversikt.with()
                            .accountid(userid)
                            .brukernavn(username)
                            .email(user.getEmail())
                            .fornavn(user.getFirstname())
                            .etternavn(user.getLastname())
                            .balanse(balanse)
                            .sumPreviousMonth(sumPreviousMonth)
                            .sumThisMonth(sumThisMonth)
                            .lastTransactionAmount(lastTransactionAmount)
                            .lastTransactionStore(lastTransactionStore)
                            .build();
                    }

                    return null;
                }
            }
        } catch (SQLException e) {
            var message = String.format("Failed to retrieve an Oversikt for user %s", brukernavn);
            logError(message, e);
            throw new HandleregException(message, e);
        }
    }

    @Override
    public List<Transaction> findLastTransactions(int userId) {
        var handlinger = new ArrayList<Transaction>();
        var sql = "select t.transaction_id, t.transaction_time, s.store_name, s.store_id, t.transaction_amount from transactions t join stores s on s.store_id=t.store_id where t.transaction_id in (select transaction_id from transactions where account_id=? order by transaction_time desc fetch next 5 rows only) order by t.transaction_time asc";
        try(var connection = datasource.getConnection()) {
            try (var statement = connection.prepareStatement(sql)) {
                statement.setInt(1, userId);
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var transaction = Transaction.with()
                            .transactionId(results.getInt(1))
                            .handletidspunkt(new Date(results.getTimestamp(2).getTime()))
                            .butikk(results.getString(3))
                            .storeId(results.getInt(4))
                            .belop(results.getDouble(5))
                            .build();
                        handlinger.add(transaction);
                    }
                }
            }
        } catch (SQLException e) {
            var message = String.format("Failed to retrieve a list of transactions for user %d", userId);
            logError(message, e);
            throw new HandleregException(message, e);
        }
        return handlinger;
    }

    @Override
    public Oversikt registrerHandling(NyHandling handling) {
        var transactionTime = handling.handletidspunkt() == null ? new Date() : handling.handletidspunkt();
        var sql = "insert into transactions (account_id, store_id, transaction_amount, transaction_time) values ((select account_id from accounts where username=?), ?, ?, ?)";
        try(var connection = datasource.getConnection()) {
            try(var statement = connection.prepareStatement(sql)) {
                statement.setString(1, handling.username());
                statement.setInt(2, handling.storeId());
                statement.setDouble(3, handling.belop());
                statement.setTimestamp(4, Timestamp.from(transactionTime.toInstant()));
                statement.executeUpdate();
                return finnOversikt(handling.username());
            }
        } catch (SQLException e) {
            var message = String.format("Failed to register purchase for user %s", handling.username());
            logError(message, e);
            throw new HandleregException(message, e);
        }
    }

    @Override
    public List<Butikk> finnButikker() {
        var butikker = new ArrayList<Butikk>();
        var sql = "select * from stores where not deaktivert order by gruppe, rekkefolge";
        try (var connection = datasource.getConnection()) {
            try (var statement = connection.prepareStatement(sql)) {
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var butikk = Butikk.with()
                            .storeId(results.getInt(1))
                            .butikknavn(results.getString(2))
                            .gruppe(results.getInt(3))
                            .rekkefolge(results.getInt(4))
                            .build();
                        butikker.add(butikk);
                    }
                }
            }
        } catch (SQLException e) {
            String message = "Failed to retrieve a list of stores";
            logError(message, e);
            throw new HandleregException(message, e);
        }
        return butikker;
    }

    @Override
    public List<Butikk> endreButikk(Butikk butikkSomSkalEndres) {
        var butikkId = butikkSomSkalEndres.storeId();
        var butikknavn = butikkSomSkalEndres.butikknavn();
        var gruppe = butikkSomSkalEndres.gruppe();
        var rekkefolge = butikkSomSkalEndres.rekkefolge();
        var sql = "update stores set store_name=?, gruppe=?, rekkefolge=? where store_id=?";
        try (var connection = datasource.getConnection()) {
            try(var statement = connection.prepareStatement(sql)) {
                statement.setString(1, butikknavn);
                statement.setInt(2, gruppe);
                statement.setInt(3, rekkefolge);
                statement.setInt(4, butikkId);
                statement.executeUpdate();
                return finnButikker();
            }
        } catch (SQLException e) {
            var message = String.format("Failed to insert store \"%s\" in group %d, sort order %s", butikkSomSkalEndres.butikknavn(), gruppe, rekkefolge);
            logError(message, e);
            throw new HandleregException(message, e);
        }
    }

    @Override
    public List<Butikk> leggTilButikk(Butikk nybutikk) {
        var gruppe = nybutikk.gruppe() < 1 ? 2 : nybutikk.gruppe();
        var rekkefolge = nybutikk.rekkefolge() < 1 ? finnNesteLedigeRekkefolgeForGruppe(gruppe) : nybutikk.rekkefolge();
        var sql = "insert into stores (store_name, gruppe, rekkefolge) values (?, ?, ?)";
        try (var connection = datasource.getConnection()) {
            try(var statement = connection.prepareStatement(sql)) {
                statement.setString(1, nybutikk.butikknavn());
                statement.setInt(2, gruppe);
                statement.setInt(3, rekkefolge);
                statement.executeUpdate();
                return finnButikker();
            }
        } catch (SQLException e) {
            var message = String.format("Failed to modify store \"%s\" in group %d, sort order %s", nybutikk.butikknavn(), gruppe, rekkefolge);
            logError(message, e);
            throw new HandleregException(message, e);
        }
    }

    @Override
    public List<ButikkSum> sumOverButikk() {
        var sumOverButikk = new ArrayList<ButikkSum>();
        var sql = "select s.store_id, s.store_name, s.gruppe, s.rekkefolge, sum(t.transaction_amount) as totalbelop from transactions t join stores s on s.store_id=t.store_id group by s.store_id, s.store_name, s.gruppe, s.rekkefolge order by totalbelop desc";
        try (var connection = datasource.getConnection()) {
            try (var statement = connection.prepareStatement(sql)) {
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var butikk = Butikk.with()
                            .storeId(results.getInt(1))
                            .butikknavn(results.getString(2))
                            .gruppe(results.getInt(3))
                            .rekkefolge(results.getInt(4))
                            .build();
                        var butikkSum = ButikkSum.with()
                            .butikk(butikk)
                            .sum(results.getDouble(5))
                            .build();
                        sumOverButikk.add(butikkSum);
                    }
                }
            }
        } catch (SQLException e) {
            var message = "Got error when retrieving sum over stores";
            logWarning(message, e);
        }
        return sumOverButikk;
    }

    @Override
    public List<ButikkCount> antallHandlingerIButikk() {
        var antallHandlerIButikk = new ArrayList<ButikkCount>();
        var sql = "select s.store_id, s.store_name, s.gruppe, s.rekkefolge, count(t.transaction_amount) as antallbesok from transactions t join stores s on s.store_id=t.store_id group by s.store_id, s.store_name, s.gruppe, s.rekkefolge order by antallbesok desc";
        try (var connection = datasource.getConnection()) {
            try (var statement = connection.prepareStatement(sql)) {
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var butikk = Butikk.with()
                            .storeId(results.getInt(1))
                            .butikknavn(results.getString(2))
                            .gruppe(results.getInt(3))
                            .rekkefolge(results.getInt(4))
                            .build();
                        var butikkSum = ButikkCount.with()
                            .butikk(butikk)
                            .count(results.getLong(5))
                            .build();
                        antallHandlerIButikk.add(butikkSum);
                    }
                }
            }
        } catch (SQLException e) {
            var message = "Got error when retrieving count of the number of times store have been visited";
            logWarning(message, e);
        }
        return antallHandlerIButikk;
    }

    @Override
    public List<ButikkDate> sisteHandelIButikk() {
        var sisteHandelIButikk = new ArrayList<ButikkDate>();
        var sql = "select s.store_id, s.store_name, s.gruppe, s.rekkefolge, MAX(t.transaction_time) as handletid from transactions t join stores s on s.store_id=t.store_id group by s.store_id, s.store_name, s.gruppe, s.rekkefolge order by handletid desc";
        try (var connection = datasource.getConnection()) {
            try (var statement = connection.prepareStatement(sql)) {
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var butikk = Butikk.with()
                            .storeId(results.getInt(1))
                            .butikknavn(results.getString(2))
                            .gruppe(results.getInt(3))
                            .rekkefolge(results.getInt(4))
                            .build();
                        var butikkSum = ButikkDate.with()
                            .butikk(butikk)
                            .date(new Date(results.getTimestamp(5).getTime()))
                            .build();
                        sisteHandelIButikk.add(butikkSum);
                    }
                }
            }
        } catch (SQLException e) {
            var message = "Got error when retrieving last visit times for stores";
            logWarning(message, e);
        }
        return sisteHandelIButikk;
    }

    @Override
    public List<SumYear> totaltHandlebelopPrAar() {
        var totaltHandlebelopPrAar = new ArrayList<SumYear>();
        try (var connection = datasource.getConnection()) {
            try (var statement = connection.prepareStatement("select * from sum_over_year_view")) {
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var sumMonth = SumYear.with()
                            .sum(results.getDouble(1))
                            .year(Year.of(results.getInt(2)))
                            .build();
                        totaltHandlebelopPrAar.add(sumMonth);
                    }
                }
            }
        } catch (SQLException e) {
            var message = "Got error when retrieving total amount used per year";
            logWarning(message, e);
        }
        return totaltHandlebelopPrAar;
    }

    @Override
    public List<SumYearMonth> totaltHandlebelopPrAarOgMaaned() {
        var totaltHandlebelopPrAarOgMaaned = new ArrayList<SumYearMonth>();
        try (var connection = datasource.getConnection()) {
            try (var statement = connection.prepareStatement("select * from sum_over_month_view")) {
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var sumMonth = SumYearMonth.with()
                            .sum(results.getDouble(1))
                            .year(Year.of(results.getInt(2)))
                            .month(Month.of(results.getInt(3)))
                            .build();
                        totaltHandlebelopPrAarOgMaaned.add(sumMonth);
                    }
                }
            }
        } catch (SQLException e) {
            var message = "Got error when retrieving total amount used per year";
            logWarning(message, e);
        }
        return totaltHandlebelopPrAarOgMaaned;
    }

    @Override
    public List<Favoritt> finnFavoritter(String brukernavn) {
        var favoritter = new ArrayList<Favoritt>();
        var sql = "select * from accounts a join favourites f on a.account_id=f.account_id join stores s on f.store_id=s.store_id where a.username=? order by f.rekkefolge";
        try (var connection = datasource.getConnection()) {
            try (var statement = connection.prepareStatement(sql)) {
                statement.setString(1, brukernavn);
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var butikk = Butikk.with()
                            .storeId(results.getInt(7))
                            .butikknavn(results.getString(8))
                            .gruppe(results.getInt(9))
                            .rekkefolge(results.getInt(10))
                            .build();
                        var favoritt = Favoritt.with()
                            .favouriteid(results.getInt(3))
                            .accountid(results.getInt(4))
                            .store(butikk)
                            .rekkefolge(results.getInt(6))
                            .build();
                        favoritter.add(favoritt);
                    }
                }
            }
        } catch (SQLException e) {
            var message = "Failed to retrieve a list of favourites";
            logError(message, e);
            throw new HandleregException(message, e);
        }
        return favoritter;
    }

    @Override
    public List<Favoritt> leggTilFavoritt(NyFavoritt nyFavoritt) {
        try (var connection = datasource.getConnection()) {
            var sisteRekkefolge = finnSisteRekkefolgeIBrukersFavoritter(connection, nyFavoritt.brukernavn());
            var sql = "insert into favourites (account_id, store_id, rekkefolge) values ((select account_id from accounts where username=?), ?, ?)";
            try (var statement = connection.prepareStatement(sql)) {
                statement.setString(1, nyFavoritt.brukernavn());
                statement.setInt(2, nyFavoritt.butikk().storeId());
                statement.setInt(3, sisteRekkefolge + 1);
                statement.executeUpdate();
            }
        } catch (SQLException e) {
            var message = "Failed to insert a new favourite";
            logError(message, e);
            throw new HandleregException(message, e);
        }
        return finnFavoritter(nyFavoritt.brukernavn());
    }

    @Override
    public List<Favoritt> slettFavoritt(Favoritt skalSlettes) {
        try (var connection = datasource.getConnection()) {
            var sql = "delete from favourites where favourite_id=?";
            try (var statement = connection.prepareStatement(sql)) {
                statement.setInt(1, skalSlettes.favouriteid());
                statement.executeUpdate();
            }
        } catch (SQLException e) {
            var message = "Failed to delete favourite";
            logError(message, e);
            throw new HandleregException(message, e);
        }
        return finnFavoritterMedAccountid(skalSlettes.accountid());
    }

    @Override
    public List<Favoritt> byttRekkefolge(Favorittpar parSomSkalBytteRekkfolge) {
        try (var connection = datasource.getConnection()) {
            var sql = "update favourites set rekkefolge=? where favourite_id=?";
            try (var flipstatement1 = connection.prepareStatement(sql)) {
                flipstatement1.setInt(1, parSomSkalBytteRekkfolge.andre().rekkefolge());
                flipstatement1.setInt(2, parSomSkalBytteRekkfolge.forste().favouriteid());
                flipstatement1.executeUpdate();
            }
            try (var flipstatement2 = connection.prepareStatement(sql)) {
                flipstatement2.setInt(1, parSomSkalBytteRekkfolge.forste().rekkefolge());
                flipstatement2.setInt(2, parSomSkalBytteRekkfolge.andre().favouriteid());
                flipstatement2.executeUpdate();
            }
        } catch (SQLException e) {
            var message = "Failed to swap order of favourites";
            logError(message, e);
            throw new HandleregException(message, e);
        }
        return finnFavoritterMedAccountid(parSomSkalBytteRekkfolge.forste().accountid());
    }

    int finnNesteLedigeRekkefolgeForGruppe(int gruppe) {
        var sql = "select rekkefolge from stores where gruppe=? order by rekkefolge desc fetch next 1 rows only";
        try (var connection = datasource.getConnection()) {
            try(var statement = connection.prepareStatement(sql)) {
                statement.setInt(1, gruppe);
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var sortorderValueOfLastStore = results.getInt(1);
                        return sortorderValueOfLastStore + 10;
                    }
                }
            }
        } catch (SQLException e) {
            var message = String.format("Failed to retrieve the next store sort order value for group %d", gruppe);
            logError(message, e);
            throw new HandleregException(message, e);
        }

        return 0;
    }

    List<Favoritt> finnFavoritterMedAccountid(int accountid) {
        var favoritter = new ArrayList<Favoritt>();
        var sql = "select * from favourites f join stores s on f.store_id=s.store_id where f.account_id=? order by f.rekkefolge";
        try (var connection = datasource.getConnection()) {
            try (var statement = connection.prepareStatement(sql)) {
                statement.setInt(1, accountid);
                try (var results = statement.executeQuery()) {
                    while(results.next()) {
                        var butikk = Butikk.with()
                            .storeId(results.getInt(5))
                            .butikknavn(results.getString(6))
                            .gruppe(results.getInt(7))
                            .rekkefolge(results.getInt(8))
                            .build();
                        var favoritt = Favoritt.with()
                            .favouriteid(results.getInt(1))
                            .accountid(results.getInt(2))
                            .store(butikk)
                            .rekkefolge(results.getInt(4))
                            .build();
                        favoritter.add(favoritt);
                    }
                }
            }
        } catch (SQLException e) {
            var message = "Failed to retrieve a list of favourites";
            logError(message, e);
            throw new HandleregException(message, e);
        }
        return favoritter;
    }

    int finnSisteRekkefolgeIBrukersFavoritter(Connection connection, String brukernavn) {
        var sql = "select * from accounts a join favourites f on a.account_id=f.account_id where a.username=? order by f.rekkefolge desc";
        try (var statement = connection.prepareStatement(sql)) {
            statement.setString(1, brukernavn);
            try (var results = statement.executeQuery()) {
                while(results.next()) {
                    return results.getInt(6);
                }
            }
        } catch (SQLException e) {
            logWarning("Failed to retrieve last favourite rekkefolge value", e);
        }
        return 0;
    }

    private void addRolesIfNotpresent() {
        var handleregbruker = HANDLEREGBRUKER_ROLE;
        var roles = useradmin.getRoles();
        var existingRole = roles.stream().filter(r -> handleregbruker.equals(r.getRolename())).findFirst();
        if (!existingRole.isPresent()) {
            useradmin.addRole(Role.with().id(-1).rolename(handleregbruker).description("Bruker av applikasjonen handlereg").build());
        }
    }

    private void logError(String message, SQLException e) {
        logger.error(message, e);
    }

    private void logWarning(String message, SQLException e) {
        logger.warn(message, e);
    }

}
