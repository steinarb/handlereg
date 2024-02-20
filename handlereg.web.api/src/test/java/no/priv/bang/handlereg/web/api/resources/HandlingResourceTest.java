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
package no.priv.bang.handlereg.web.api.resources;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

import java.util.Arrays;
import java.util.Date;
import javax.ws.rs.InternalServerErrorException;

import org.junit.jupiter.api.Test;

import no.priv.bang.handlereg.services.HandleregException;
import no.priv.bang.handlereg.services.HandleregService;
import no.priv.bang.handlereg.services.NyHandling;
import no.priv.bang.handlereg.services.Oversikt;
import no.priv.bang.handlereg.services.Transaction;
import no.priv.bang.osgi.service.mocks.logservice.MockLogService;

class HandlingResourceTest {

    @Test
    void testGetHandlinger() {
        var logservice = new MockLogService();
        var handlereg = mock(HandleregService.class);
        when(handlereg.findLastTransactions(1)).thenReturn(Arrays.asList(Transaction.with().build()));
        var resource = new HandlingResource();
        resource.setLogservice(logservice);
        resource.handlereg = handlereg;
        var handlinger = resource.getHandlinger(1);
        assertThat(handlinger).isNotEmpty();
    }

    @Test
    void testGetHandlingerEmpty() {
        var logservice = new MockLogService();
        var handlereg = mock(HandleregService.class);
        var resource = new HandlingResource();
        resource.setLogservice(logservice);
        resource.handlereg = handlereg;
        var handlinger = resource.getHandlinger(1);
        assertThat(handlinger).isEmpty();
    }

    @Test
    void testGetHandlingerWhenExceptionIsThrown() {
        var logservice = new MockLogService();
        var handlereg = mock(HandleregService.class);
        when(handlereg.findLastTransactions(anyInt())).thenThrow(HandleregException.class);
        var resource = new HandlingResource();
        resource.setLogservice(logservice);
        resource.handlereg = handlereg;

        assertThrows(InternalServerErrorException.class, () -> {
                resource.getHandlinger(1);
            });
    }

    @Test
    void testNyhandling() {
        var logservice = new MockLogService();
        var handlereg = mock(HandleregService.class);
        var oversikt = Oversikt.with()
            .accountid(1)
            .brukernavn("jd")
            .email("johndoe@gmail.com")
            .fornavn("John")
            .etternavn("Doe")
            .balanse(500)
            .build();
        when(handlereg.registrerHandling(any())).thenReturn(oversikt);
        var resource = new HandlingResource();
        resource.setLogservice(logservice);
        resource.handlereg = handlereg;
        var handling = NyHandling.with()
            .username("jd")
            .accountid(1)
            .storeId(1)
            .belop(510)
            .handletidspunkt(new Date())
            .build();
        var oppdatertOversikt = resource.nyhandling(handling);
        assertEquals(oversikt.getBalanse(), oppdatertOversikt.getBalanse());
    }

    @Test
    void testNyhandlingWhenExceptionIsThrown() {
        var logservice = new MockLogService();
        var handlereg = mock(HandleregService.class);
        when(handlereg.registrerHandling(any())).thenThrow(HandleregException.class);
        var resource = new HandlingResource();
        resource.setLogservice(logservice);
        resource.handlereg = handlereg;
        var handling = NyHandling.with()
            .username("jd")
            .accountid(1)
            .storeId(1)
            .belop(510)
            .handletidspunkt(new Date())
            .build();
        assertThrows(InternalServerErrorException.class, () -> {
                resource.nyhandling(handling);
            });
    }

}
