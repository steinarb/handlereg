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
package no.priv.bang.handlereg.services;

import java.time.Year;

public record SumYear(double sum, Year year) {

    public static Builder with() {
        return new Builder();
    }

    public static class Builder {
        private double sum;
        private Year year;

        protected Builder() {}

        public SumYear build() {
            return new SumYear(sum, year);
        }

        public Builder sum(double sum) {
            this.sum = sum;
            return this;
        }

        public Builder year(Year year) {
            this.year = year;
            return this;
        }
    }

}
