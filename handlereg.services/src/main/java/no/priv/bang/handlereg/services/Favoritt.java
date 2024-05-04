/*
 * Copyright 2021-2024 Steinar Bang
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

import no.priv.bang.beans.immutable.Immutable;

public class Favoritt extends Immutable {
    private int favouriteid;
    private int accountid;
    private Butikk store;
    private int rekkefolge;

    private Favoritt() {}

    public int getFavouriteid() {
        return favouriteid;
    }

    public int getAccountid() {
        return accountid;
    }

    public Butikk getStore() {
        return store;
    }

    public int getRekkefolge() {
        return rekkefolge;
    }

    @Override
    public String toString() {
        return "Favoritt [favouriteid=" + favouriteid + ", accountid=" + accountid + ", store=" + store + ", rekkefolge=" + rekkefolge + "]";
    }

    public static Builder with() {
        return new Builder();
    }

    public static class Builder {
        private int favouriteid = -1;
        private int accountid = -1;
        private Butikk store;
        private int rekkefolge = -1;

        private Builder() {}

        public Favoritt build() {
            var favoritt = new Favoritt();
            favoritt.favouriteid = this.favouriteid;
            favoritt.accountid = this.accountid;
            favoritt.store = this.store;
            favoritt.rekkefolge = this.rekkefolge;
            return favoritt;
        }

        public Builder favouriteid(int favouriteid) {
            this.favouriteid = favouriteid;
            return this;
        }

        public Builder accountid(int accountid) {
            this.accountid = accountid;
            return this;
        }

        public Builder store(Butikk store) {
            this.store = store;
            return this;
        }

        public Builder rekkefolge(int rekkefolge) {
            this.rekkefolge = rekkefolge;
            return this;
        }


    }

}
