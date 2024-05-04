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
package no.priv.bang.handlereg.backend.testdata;

import java.util.Arrays;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import no.priv.bang.handlereg.services.HandleregService;
import no.priv.bang.osgiservice.users.UserManagementService;
import no.priv.bang.osgiservice.users.UserRoles;
import static no.priv.bang.handlereg.services.HandleregConstants.*;

@Component(immediate=true)
public class HandleregTestdata {

    private UserManagementService useradmin;

    @Reference
    public void setHandleregService(HandleregService handlereg) {
        // Brukes bare til å bestemme rekkefølge på kjøring
        // Når denne blir kalt vet vi at authservice har
        // rollen handleregbruker lagt til
    }

    @Reference
    public void setUseradmin(UserManagementService useradmin) {
        this.useradmin = useradmin;
    }

    @Activate
    public void activate() {
        addRolesForTestusers();
    }

    void addRolesForTestusers() {
        var handleregbruker = useradmin.getRoles().stream().filter(r -> HANDLEREGBRUKER_ROLE.equals(r.getRolename())).findFirst().get(); // NOSONAR testkode
        var jod = useradmin.getUser("jod");
        useradmin.addUserRoles(UserRoles.with().user(jod).roles(Arrays.asList(handleregbruker)).build());
        var jad = useradmin.getUser("jad");
        useradmin.addUserRoles(UserRoles.with().user(jad).roles(Arrays.asList(handleregbruker)).build());
    }

}
