/*
 * Copyright 2019-2024 Steinar Bang
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

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;

import org.ops4j.pax.jdbc.hook.PreHook;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.log.LogService;
import org.osgi.service.log.Logger;

import no.priv.bang.handlereg.db.liquibase.HandleregLiquibase;
import no.priv.bang.handlereg.services.HandleregException;

@Component(immediate=true, property = "name=handleregdb")
public class HandleregProductionDbLiquibaseRunner implements PreHook {

    private Logger logger;

    @Reference
    public void setLogService(LogService logservice) {
        this.logger = logservice.getLogger(HandleregProductionDbLiquibaseRunner.class);
    }

    @Activate
    public void activate() {
        // Called after all injections have been satisfied and before the PreHook service is exposed
    }

    @Override
    public void prepare(DataSource datasource) throws SQLException {
        var handleregLiquibase = new HandleregLiquibase();
        try (var connect = datasource.getConnection()) {
            handleregLiquibase.createInitialSchema(connect);
        } catch (Exception e) {
            logError("Failed to create initial schema of handlereg PostgreSQL database", e);
        }

        try (Connection connect = datasource.getConnection()) {
            insertMockData(connect, handleregLiquibase);
        }

        try (var connect = datasource.getConnection()) {
            handleregLiquibase.updateSchema(connect);
        } catch (Exception e) {
            logError("Failed to update schema of handlereg PostgreSQL database", e);
        }
    }

    public void insertMockData(Connection connect, HandleregLiquibase liquibase) {
        try {
            liquibase.applyLiquibaseChangelist(connect, "sql/data/db-changelog.xml", getClass().getClassLoader());
        } catch (Exception e) {
            throw new HandleregException("Error inserting initial data in handlereg postgresql database", e);
        }
    }

    private void logError(String message, Exception exception) {
        logger.error(message, exception);
    }

}
