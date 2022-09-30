/*
 * Copyright 2018-2022 Steinar Bang
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

import java.sql.Connection;
import liquibase.Liquibase;
import liquibase.database.DatabaseConnection;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.LiquibaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import no.priv.bang.handlereg.services.HandleregException;

public class HandleregLiquibase {

    public void createInitialSchema(Connection connection) throws LiquibaseException {
        applyLiquibaseChangelist(connection, "handlereg-db-changelog/db-changelog-1.0.0.xml");
    }

    public void updateSchema(Connection connection) throws LiquibaseException {
        applyLiquibaseChangelist(connection, "handlereg-db-changelog/db-changelog-1.0.1.xml");
    }

    public void forceReleaseLocks(Connection connection) throws LiquibaseException {
        DatabaseConnection databaseConnection = new JdbcConnection(connection);
        try(var classLoaderResourceAccessor = new ClassLoaderResourceAccessor(getClass().getClassLoader())) {
            try(var liquibase = new Liquibase("handlereg-db-changelog/db-changelog-1.0.0.xml", classLoaderResourceAccessor, databaseConnection)) {
                liquibase.forceReleaseLocks();
            }
        } catch (LiquibaseException e) {
            throw e;
        } catch (Exception e) {
            throw new HandleregException("Error closing resource when forcing Liquibase changelist lock for handlereg database", e);
        }
    }

    private void applyLiquibaseChangelist(Connection connection, String changelistClasspathResource) throws LiquibaseException {
        DatabaseConnection databaseConnection = new JdbcConnection(connection);
        try(var classLoaderResourceAccessor = new ClassLoaderResourceAccessor(getClass().getClassLoader())) {
            try(var liquibase = new Liquibase(changelistClasspathResource, classLoaderResourceAccessor, databaseConnection)) {
                liquibase.update("");
            }
        } catch (LiquibaseException e) {
            throw e;
        } catch (Exception e) {
            throw new HandleregException("Error closing resource when applying Liquibase changelist for handlereg database", e);
        }
    }

}
