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
package no.priv.bang.handlereg.web.api.resources;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.apache.shiro.authz.annotation.RequiresUser;
import org.apache.shiro.subject.Subject;
import org.osgi.service.log.LogService;
import org.osgi.service.log.Logger;

import no.priv.bang.handlereg.services.HandleregService;
import no.priv.bang.handlereg.services.Oversikt;


@Path("/oversikt")
@Produces(MediaType.APPLICATION_JSON)
@RequiresUser
@RequiresRoles("handleregbruker")
public class OversiktResource {

    private Logger logger;

    @Inject
    HandleregService handlereg;

    @Inject
    public void setLogservice(LogService logservice) {
        this.logger = logservice.getLogger(OversiktResource.class);
    }

    @GET
    public Oversikt get() {
        try {
            Subject subject = SecurityUtils.getSubject();
            String brukernavn = (String) subject.getPrincipal();
            return handlereg.finnOversikt(brukernavn);
        } catch (Exception e) {
            String message = "Failed to get Oversikt in handlereg";
            logger.error(message, e);
            throw new InternalServerErrorException(message + ", see the log for details");
        }
    }

}
