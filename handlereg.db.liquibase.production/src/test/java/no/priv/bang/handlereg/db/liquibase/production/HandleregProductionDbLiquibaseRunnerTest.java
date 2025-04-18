/*
 * Copyright 2019-2025 Steinar Bang
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
package no.priv.bang.handlereg.db.liquibase.production;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.db.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.sql.SQLException;
import java.util.Properties;

import javax.sql.DataSource;

import org.assertj.db.type.AssertDbConnectionFactory;
import org.junit.jupiter.api.Test;
import org.ops4j.pax.jdbc.derby.impl.DerbyDataSourceFactory;
import org.osgi.service.jdbc.DataSourceFactory;

import no.priv.bang.handlereg.db.liquibase.HandleregLiquibase;
import no.priv.bang.handlereg.services.HandleregException;
import no.priv.bang.osgi.service.mocks.logservice.MockLogService;

class HandleregProductionDbLiquibaseRunnerTest {

    @Test
    void testCreateAndVerifySomeDataInSomeTables() throws Exception {
        var dataSourceFactory = new DerbyDataSourceFactory();
        var properties = new Properties();
        properties.setProperty(DataSourceFactory.JDBC_URL, "jdbc:derby:memory:handlereg;create=true");
        var datasource = dataSourceFactory.createDataSource(properties);
        var assertjConnection = AssertDbConnectionFactory.of(datasource).create();

        var logservice = new MockLogService();
        var runner = new HandleregProductionDbLiquibaseRunner();
        runner.setLogService(logservice);
        runner.activate();
        runner.prepare(datasource);
        var jdId = addAccount(datasource, "jd");
        var accounts = assertjConnection.table("accounts").build();
        assertThat(accounts).exists().hasNumberOfRows(1).row(0).value("username").isEqualTo("jd");
        var storeid = addStore(datasource, "Spar Næroset");
        var originalNumberOfTransactions = assertjConnection.table("transactions").build().getRowsList().size();
        addTransaction(datasource, jdId, storeid, 138);
        var updatedTransactions = assertjConnection.table("transactions").build();
        assertThat(updatedTransactions.getRowsList()).hasSizeGreaterThan(originalNumberOfTransactions);
    }

    @Test
    void testFailWhenCreatingInitialSchema() throws Exception {
        var realdb = createDataSource("handlereg1");
        var connection = spy(realdb.getConnection());
        // The wrapped JDBC connection throws SQLException on setAutoCommit(anyBoolean());
        var datasource = spy(realdb);
        when(datasource.getConnection())
            .thenReturn(connection)
            .thenCallRealMethod()
            .thenCallRealMethod();

        var logservice = new MockLogService();
        var runner = new HandleregProductionDbLiquibaseRunner();
        runner.setLogService(logservice);
        runner.activate();
        assertThat(logservice.getLogmessages()).isEmpty();
        runner.prepare(datasource);
        assertThat(logservice.getLogmessages()).isNotEmpty();
        assertThat(logservice.getLogmessages().get(0)).startsWith("[ERROR] Failed to create initial schema of handlereg PostgreSQL database");
    }

    @Test
    void testFailWhenInsertingMockDataBecauseNoSchema() throws Exception {
        var connection = spy(createDataSource("handlereg2").getConnection());
        var liquibase = new HandleregLiquibase();

        var logservice = new MockLogService();
        var runner = new HandleregProductionDbLiquibaseRunner();
        runner.setLogService(logservice);
        runner.activate();
        var e = assertThrows(HandleregException.class, () -> runner.insertMockData(connection, liquibase));
        assertThat(e.getMessage()).startsWith("Error inserting initial data in handlereg postgresql database");
    }

    @Test
    void testFailWhenUpdatingsSchema() throws Exception {
        var connection = spy(createDataSource("handlereg3").getConnection());
        // The wrapped JDBC connection throws SQLException on setAutoCommit(anyBoolean());
        var datasource = spy(createDataSource("handlereg4"));
        when(datasource.getConnection())
            .thenCallRealMethod()
            .thenCallRealMethod()
            .thenReturn(connection);

        var logservice = new MockLogService();
        var runner = new HandleregProductionDbLiquibaseRunner();
        runner.setLogService(logservice);
        runner.activate();
        assertThat(logservice.getLogmessages()).isEmpty();
        runner.prepare(datasource);
        assertThat(logservice.getLogmessages()).isNotEmpty();
        assertThat(logservice.getLogmessages().get(0)).startsWith("[ERROR] Failed to update schema of handlereg PostgreSQL database");
    }

    private int addAccount(DataSource datasource, String username) throws Exception {
        try (var connection = datasource.getConnection()) {
            try(var statement = connection.prepareStatement("insert into accounts (username) values (?)")) {
                statement.setString(1, username);
                statement.executeUpdate();
            }
        }
        var accountId = -1;
        try (var connection = datasource.getConnection()) {
            try(var statement = connection.prepareStatement("select * from accounts where username=?")) {
                statement.setString(1, username);
                try (var results = statement.executeQuery()) {
                    results.next();
                    accountId = results.getInt(1);
                }
            }
        }
        return accountId;
    }

    private int addStore(DataSource datasource, String storename) throws Exception {
        try (var connection = datasource.getConnection()) {
            try(var statement = connection.prepareStatement("insert into stores (store_name) values (?)")) {
                statement.setString(1, storename);
                statement.executeUpdate();
            }
        }
        var storeid = -1;
        try (var connection = datasource.getConnection()) {
            try(var statement = connection.prepareStatement("select * from stores where store_name=?")) {
                statement.setString(1, storename);
                try (var results = statement.executeQuery()) {
                    results.next();
                    storeid = results.getInt(1);
                }
            }
        }
        return storeid;
    }

    private void addTransaction(DataSource datasource, int accountid, int storeid, double amount) throws SQLException {
        try (var connection = datasource.getConnection()) {
            try(var statement = connection.prepareStatement("insert into transactions (account_id, store_id, transaction_amount) values (?, ?, ?)")) {
                statement.setInt(1, accountid);
                statement.setInt(2, storeid);
                statement.setDouble(3, amount);
                statement.executeUpdate();
            }
        }
    }

    private DataSource createDataSource(String dbname) throws SQLException {
        var dataSourceFactory = new DerbyDataSourceFactory();
        var properties = new Properties();
        properties.setProperty(DataSourceFactory.JDBC_URL, "jdbc:derby:memory:" + dbname + ";create=true");
        return dataSourceFactory.createDataSource(properties);
    }

}
