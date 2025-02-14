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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import javax.ws.rs.InternalServerErrorException;

import org.junit.jupiter.api.Test;

import no.priv.bang.handlereg.services.HandleregService;
import no.priv.bang.handlereg.services.Oversikt;
import no.priv.bang.handlereg.web.api.ShiroTestBase;
import no.priv.bang.osgi.service.mocks.logservice.MockLogService;

class OversiktResourceTest extends ShiroTestBase {

    @Test
    void testGetOversikt() {
        var handlereg = mock(HandleregService.class);
        var jdOversikt = Oversikt.with()
            .accountid(1)
            .brukernavn("jd")
            .email("johndoe@gmail.com")
            .fornavn("John")
            .etternavn("Doe")
            .balanse(1500)
            .build();
        when(handlereg.finnOversikt("jd")).thenReturn(jdOversikt);
        var resource = new OversiktResource();
        resource.handlereg = handlereg;
        loginUser("jd", "johnnyBoi");

        var oversikt = resource.get();
        assertEquals("jd", oversikt.brukernavn());
    }

    @Test
    void testGetOversiktNotLoggedIn() {
        var logservice = new MockLogService();
        var handlereg = mock(HandleregService.class);
        var jdOversikt = Oversikt.with()
            .accountid(1)
            .brukernavn("jd")
            .email("johndoe@gmail.com")
            .fornavn("John")
            .etternavn("Doe")
            .balanse(1500)
            .build();
        when(handlereg.finnOversikt("jd")).thenReturn(jdOversikt);
        var resource = new OversiktResource();
        resource.setLogservice(logservice);
        resource.handlereg = handlereg;
        removeWebSubjectFromThread();

        assertThrows(InternalServerErrorException.class, resource::get);
    }

}
