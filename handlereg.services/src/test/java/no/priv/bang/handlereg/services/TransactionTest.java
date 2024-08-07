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
package no.priv.bang.handlereg.services;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;

import org.junit.jupiter.api.Test;

class TransactionTest {

    @Test
    void testCreate() {
        var now = new Date();
        var bean = Transaction.with()
            .transactionId(1)
            .handletidspunkt(now)
            .butikk("Spar fjellheimen")
            .storeId(101)
            .belop(107.0)
            .build();
        assertEquals(1, bean.transactionId());
        assertEquals(now, bean.handletidspunkt());
        assertEquals("Spar fjellheimen", bean.butikk());
        assertEquals(101, bean.storeId());
        assertEquals(107.0, bean.belop(), 1.0);
    }

    @Test
    void testCreateWithNoargsConstructor() {
        var bean = Transaction.with().build();
        assertEquals(-1, bean.transactionId());
        assertNull(bean.handletidspunkt());
        assertNull(bean.butikk());
        assertEquals(-1, bean.storeId());
        assertEquals(0.0, bean.belop(), 1.0);
    }

}
