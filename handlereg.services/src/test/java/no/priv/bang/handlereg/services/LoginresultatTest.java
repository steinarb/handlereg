/*
 * Copyright 2019 Steinar Bang
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
package no.priv.bang.handlereg.services;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class LoginresultatTest {

    @Test
    void testCreate() {
        boolean suksess = true;
        String feilmelding = "Feil passord";
        Loginresultat bean = new Loginresultat(suksess, feilmelding);
        assertTrue(bean.getSuksess());
        assertEquals(feilmelding, bean.getFeilmelding());
    }

    @Test
    void testNoargsConstructor() {
        Loginresultat bean = new Loginresultat();
        assertFalse(bean.getSuksess());
        assertNull(bean.getFeilmelding());
    }

}
