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
package no.priv.bang.handlereg.db.liquibase;

import static liquibase.Scope.Attr.resourceAccessor;
import static liquibase.command.core.UpdateCommandStep.CHANGELOG_FILE_ARG;
import static liquibase.command.core.helpers.DbUrlConnectionArgumentsCommandStep.DATABASE_ARG;

import java.sql.Connection;
import java.util.Map;

import liquibase.Scope;
import liquibase.command.CommandScope;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.DatabaseException;
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

    private void applyLiquibaseChangelist(Connection connection, String changelistClasspathResource) throws LiquibaseException {
        applyLiquibaseChangelist(connection, changelistClasspathResource, getClass().getClassLoader());
    }

    public void applyLiquibaseChangelist(Connection connection, String changelistClasspathResource, ClassLoader classLoader) throws LiquibaseException {
        try(var database = findCorrectDatabaseImplementation(connection)) {
            Scope.child(scopeObjectsWithClassPathResourceAccessor(classLoader), () -> new CommandScope("update")
                .addArgumentValue(DATABASE_ARG, database)
                .addArgumentValue(CHANGELOG_FILE_ARG, changelistClasspathResource)
                .execute());
        } catch (LiquibaseException e) {
            throw e;
        } catch (Exception e) {
            throw new HandleregException("Error closing resource when applying Liquibase changelist for handlereg database", e);
        }
    }

    private Database findCorrectDatabaseImplementation(Connection connection) throws DatabaseException {
        return DatabaseFactory.getInstance().findCorrectDatabaseImplementation(new JdbcConnection(connection));
    }

    private Map<String, Object> scopeObjectsWithClassPathResourceAccessor(ClassLoader classLoader) {
        return Map.of(resourceAccessor.name(), new ClassLoaderResourceAccessor(classLoader));
    }

}
