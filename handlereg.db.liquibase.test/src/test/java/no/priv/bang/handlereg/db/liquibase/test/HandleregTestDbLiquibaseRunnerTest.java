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
package no.priv.bang.handlereg.db.liquibase.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.db.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
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

class HandleregDerbyTestDatabaseTest {

    @Test
    void testCreateAndVerifySomeDataInSomeTables() throws Exception {
        var datasource = createDataSource("handlereg");
        var assertjConnection = AssertDbConnectionFactory.of(datasource).create();

        var logservice = new MockLogService();
        var runner = new HandleregTestDbLiquibaseRunner();
        runner.setLogService(logservice);
        runner.activate();
        runner.prepare(datasource);
        var accounts = assertjConnection.table("accounts").build();
        assertThat(accounts).exists().hasNumberOfRows(2).row(0).value("username").isEqualTo("jod");
        var originalNumberOfTransactions = assertjConnection.table("transactions").build().getRowsList().size();
        addTransaction(datasource, 138);
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
        var runner = new HandleregTestDbLiquibaseRunner();
        runner.setLogService(logservice);
        runner.activate();
        assertThat(logservice.getLogmessages()).isEmpty();
        runner.prepare(datasource);
        assertThat(logservice.getLogmessages()).isNotEmpty();
        assertThat(logservice.getLogmessages().get(0)).startsWith("[ERROR] Error creating initial schema in handlereg test database");
    }

    @Test
    void testFailWhenInsertingMockDataBecauseNoSchema() throws Exception {
        var connection = createDataSource("handlereg2").getConnection();
        var liquibase = new HandleregLiquibase();

        var logservice = new MockLogService();
        var runner = new HandleregTestDbLiquibaseRunner();
        runner.setLogService(logservice);
        runner.activate();
        var e = assertThrows(HandleregException.class, () -> runner.insertMockData(connection, liquibase));
        assertThat(e.getMessage()).startsWith("Error inserting mock data in handlereg derby test database");
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
        var runner = new HandleregTestDbLiquibaseRunner();
        runner.setLogService(logservice);
        runner.activate();
        assertThat(logservice.getLogmessages()).isEmpty();
        runner.prepare(datasource);
        assertThat(logservice.getLogmessages()).isNotEmpty();
        assertThat(logservice.getLogmessages().get(0)).startsWith("[ERROR] Error updating schema in handlereg test database");
    }

    private void addTransaction(DataSource database, double amount) throws SQLException {
        try (var connection = database.getConnection()) {
            try(var statement = connection.prepareStatement("insert into transactions (account_id, store_id, transaction_amount) values (1, 1, ?)")) {
                statement.setDouble(1, amount);
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
