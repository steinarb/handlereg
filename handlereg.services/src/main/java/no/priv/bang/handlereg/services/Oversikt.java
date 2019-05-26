/*
 * Copyright 2018 Steinar Bang
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

public class Oversikt {
    int accountid = -1;
    String brukernavn;
    private String email;
    String fornavn;
    String etternavn;
    double balanse;

    public Oversikt() {
        // jackson trenger no-args constructor
    }

    public Oversikt(int accountid, String brukernavn, String email, String fornavn, String etternavn, double balanse) {
        super();
        this.accountid = accountid;
        this.brukernavn = brukernavn;
        this.email = email;
        this.fornavn = fornavn;
        this.etternavn = etternavn;
        this.balanse = balanse;
    }

    public int getAccountid() {
        return accountid;
    }

    public String getBrukernavn() {
        return brukernavn;
    }

    public String getEmail() {
        return email;
    }

    public String getFornavn() {
        return fornavn;
    }

    public String getEtternavn() {
        return etternavn;
    }

    public double getBalanse() {
        return balanse;
    }

    @Override
    public String toString() {
        return "Oversikt [user_id=" + accountid + ", brukernavn=" + brukernavn + ", fornavn=" + fornavn + ", etternavn=" + etternavn + ", balanse=" + balanse + "]";
    }

}