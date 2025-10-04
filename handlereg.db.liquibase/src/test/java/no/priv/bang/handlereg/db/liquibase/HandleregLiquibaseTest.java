/*
 * Copyright 2018-2025 Steinar Bang
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
package no.priv.bang.handlereg.db.liquibase;

import static org.assertj.db.api.Assertions.assertThat;
import java.sql.Connection;
import java.io.PrintWriter;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.sql.DataSource;

import org.assertj.db.type.AssertDbConnectionFactory;
import org.junit.jupiter.api.Test;
import org.ops4j.pax.jdbc.derby.impl.DerbyDataSourceFactory;
import org.osgi.service.jdbc.DataSourceFactory;

class HandleregLiquibaseTest {
    DataSourceFactory derbyDataSourceFactory = new DerbyDataSourceFactory();

    @Test
    void testCreateSchema() throws Exception {
        var datasource = createDataSource("handlereg");
        var assertjConnection = AssertDbConnectionFactory.of(datasource).create();
        var handleregLiquibase = new HandleregLiquibase();
        try(var connection = datasource.getConnection()) {
            handleregLiquibase.createInitialSchema(connection);
        }

        var accounts1 = assertjConnection.table("accounts").build();
        assertThat(accounts1).isEmpty();

        addAccounts(datasource);

        var accounts2 = assertjConnection.table("accounts").build();
        assertThat(accounts2).hasNumberOfRowsGreaterThan(0);

        var stores1 = assertjConnection.table("stores").build();
        assertThat(stores1).isEmpty();

        addStores(datasource);

        var stores2 = assertjConnection.table("stores").build();
        assertThat(stores2).hasNumberOfRowsGreaterThan(0)
            .row()
            .value("store_name").isEqualTo("Joker Folldal");

        var transactions1 = assertjConnection.request("select * from transactions join stores on transactions.store_id=stores.store_id join accounts on transactions.account_id=accounts.account_id").build();
        assertThat(transactions1).isEmpty();

        addTransactions(datasource);

        var transactions2 = assertjConnection.request("select * from transactions join stores on transactions.store_id=stores.store_id join accounts on transactions.account_id=accounts.account_id").build();
        assertThat(transactions2).hasNumberOfRowsGreaterThan(0)
            .row()
            .value("transaction_amount").isEqualTo(210.0)
            .value("store_name").isEqualTo("Joker Folldal")
            .value("username").isEqualTo("admin");

        var favourites1 = assertjConnection.table("favourites").build();
        assertThat(favourites1).isEmpty();

        addFavourites(datasource);

        var favourites2 = assertjConnection.table("favourites").build();
        var accountid = findAccountId(datasource.getConnection(), "admin");
        var storeid = findStoreIds(datasource.getConnection()).entrySet().stream().findFirst().get().getValue();
        assertThat(favourites2).hasNumberOfRowsGreaterThan(0)
            .row(0)
            .value("account_id").isEqualTo(accountid)
            .value("store_id").isEqualTo(storeid)
            .value("rekkefolge").isEqualTo(10);

        try(var connection = datasource.getConnection()) {
            handleregLiquibase.updateSchema(connection);
        }
    }

    private void addAccounts(DataSource datasource) throws Exception {
        try(var connection = datasource.getConnection()) {
            addAccount(connection, "admin");
        }
    }

    private int addAccount(Connection connection, String username) throws Exception {
        var sql = "insert into accounts (username) values (?)";
        try(var statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            statement.executeUpdate();
        }

        return findAccountId(connection, username);
    }

    private int findAccountId(Connection connection, String username) throws Exception {
        var sql = "select account_id from accounts where username=?";
        try(var statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try(var results = statement.executeQuery()) {
                if (results.next()) {
                    return results.getInt(1);
                }
            }
        }

        return -1;
    }

    private Map<String, Integer> findStoreIds(Connection connection) throws Exception {
        var storeids = new HashMap<String, Integer>();
        try(var storeWriter = new PrintWriter("stores.sql")) {
            storeWriter.println("--liquibase formatted sql");
            storeWriter.println("--changeset sb:example_stores");
            try(var statement = connection.prepareStatement("select * from stores")) {
                var results = statement.executeQuery();
                while(results.next()) {
                    var storename = results.getString(2);
                    var storeid = results.getInt(1);
                    var gruppe = results.getInt(3);
                    var rekkefolge = results.getInt(4);
                    var deaktivert = results.getBoolean(5);
                    storeids.put(storename, storeid);
                    storeWriter.println(String.format("insert into stores (store_name, gruppe, rekkefolge, deaktivert) values ('%s', %d, %d, %b);", storename, gruppe, rekkefolge, deaktivert));
                }
            }
        }

        return storeids;
    }

    private void addStores(DataSource datasource) throws Exception {
        try(var connection = datasource.getConnection()) {
            addStore(connection, "Joker Folldal", 2, 10, false);
        }
    }

    private void addTransactions(DataSource datasource) throws Exception {
        try(var connection = datasource.getConnection()) {
            var accountid = 1;
            var storeid = 1;
            addTransaction(connection, accountid, storeid, 210.0);
        }
    }

    private void addStore(Connection connection, String storename, int gruppe, int rekkefolge, boolean deaktivert) throws Exception {
        try(var statement = connection.prepareStatement("insert into stores (store_name, gruppe, rekkefolge, deaktivert) values (?, ?, ?, ?)")) {
            statement.setString(1, storename);
            statement.setInt(2, gruppe);
            statement.setInt(3, rekkefolge);
            statement.setBoolean(4, deaktivert);
            statement.executeUpdate();
        }
    }

    private void addTransaction(Connection connection, int accountid, int storeid, double amount) throws Exception {
        try(var statement = connection.prepareStatement("insert into transactions (account_id, store_id, transaction_amount) values (?, ?, ?)")) {
            statement.setInt(1, accountid);
            statement.setInt(2, storeid);
            statement.setDouble(3, amount);
            statement.executeUpdate();
        }
    }

    private void addFavourites(DataSource datasource) throws Exception {
        try(var connection = datasource.getConnection()) {
            var accountid = findAccountId(connection, "admin");
            var storeid = findStoreIds(connection).entrySet().stream().findFirst().get().getValue();
            addFavourite(connection, accountid, storeid, 10);
        }
    }

    private void addFavourite(Connection connection, int accountid, int storeid, int rekkefolge) throws Exception {
        try(var statement = connection.prepareStatement("insert into favourites (account_id, store_id, rekkefolge) values (?, ?, ?)")) {
            statement.setInt(1, accountid);
            statement.setInt(2, storeid);
            statement.setInt(3, rekkefolge);
            statement.executeUpdate();
        }
    }

    private DataSource createDataSource(String dbname) throws SQLException {
        var properties = new Properties();
        properties.setProperty(DataSourceFactory.JDBC_URL, "jdbc:derby:memory:" + dbname + ";create=true");
        return derbyDataSourceFactory.createDataSource(properties);
    }

}
