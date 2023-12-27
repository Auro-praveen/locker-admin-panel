import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

const populationLimit = 61954;
const url =
  "https://cdn.jsdelivr.net/gh/apilayer/restcountries@3dc0fb110cd97bce9ddf27b3e8e1f7fbe115dc3c/src/main/resources/countriesV2.json";

const Test = () => {
  const [oData, setOdata] = useState({});
  const [inputData, setInputData] = useState();

  const [countriesAbovePop, setcountriesAbovePop] = useState([]);

  useEffect(() => {
    getValFunction(Number(0));
  }, []);

  const getValFunction = (num) => {
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // const dataLen = Number(data.length);

        // console.log(data.length);
        setOdata(data[Number(num)]);

        let countArr = [];
        let popltn = [];

        let currencyCodeSet = new Map();

        data.map((obj) => {
          if (obj.population >= populationLimit) {
            const countryCurrencies = obj.currencies;

            // const countryCurrencies = [];
            // let isCountriesCurrencyINRorUSD = false;

            countryCurrencies.map((obj) => {
              // if (obj.code === "INR" || obj.code === "USD") {
              //   isCountriesCurrencyINRorUSD = true;
              // }

              if (currencyCodeSet.has(obj.code)) {
                currencyCodeSet.set(obj.code, 2);
              } else {
                currencyCodeSet.set(obj.code, 1);
              }
            });

            countArr.push(obj);
            popltn.push(obj.population);
            

            // if (!isCountriesCurrencyINRorUSD) {
            //   countArr.push(obj);
            //   // const cObject = {obj}

            //   popltn.push(obj.population);
            // }
          }
        });

        // console.log(currencyCodeSet);

        // console.log(popltn.length);


        // popltn.sort((a, b) => {
        //   return b - a;
        // });





        // console.log(popltn.length);

        // console.log(countArr);

        setcountriesAbovePop([...countArr]);
        // console.log(data[Number(num)]);
        // console.log(currencyCodeSet);
        currencyCodeSet.forEach((value, key) => {
          // console.log(value, key);
          if (value === 1) {
            currencyCodeSet.delete(key);
          }
        });

        // console.log(currencyCodeSet);

        // let filteredResult;

        new Promise(() => {
          filterCountriesWithCommonCurrency(currencyCodeSet, countArr).then(
            (res) => {
              // countriesOperation(popltn, countArr, currencyCodeSet);
              countriesOperation(res[0], res[1]);
              console.log(res);
            }
          );
        });

        // console.log(currencyCodeSet.values().return((val) => {val > 2}));

        // countriesOperation(popltn, countArr, currencyCodeSet);
        // currencyCodeSet.has
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterCountriesWithCommonCurrency = async (
    repeatedCurrencyMap,
    countryArrToFilter
  ) => {
    const repeatedCurrency = new Map(repeatedCurrencyMap);

    const countriesFilterArr = [...countryArrToFilter];

    // console.log(repeatedCurrency);
    console.log(countriesFilterArr.length);

    let filteredArr = [];
    let populationFilter = [];

    


    for (let index = 0; index < countriesFilterArr.length; index++) {
      const currency = countriesFilterArr[index].currencies;

      // console.log(currency);

      if (currency.length === 1) {
        // console.log("Nothing is here");
        if (!repeatedCurrency.has(currency[0].code)) {
          filteredArr.push(countriesFilterArr[index]);
          populationFilter.push(countriesFilterArr[index].population);
        }
      } else {
        if (
          !repeatedCurrency.has(currency[0].code) ||
          !repeatedCurrency.has(currency[1].code)
        ) {
          filteredArr.push(countriesFilterArr[index]);
          populationFilter.push(countriesFilterArr[index].population);
        }
      }
    }

    populationFilter.sort((a, b) => {
      return a - b;
    });

    console.log(filteredArr.length);

    return [populationFilter, filteredArr];
  };


  const countriesOperation = (poplutationStat, countriesArr) => {
    
    let populationWiseSortedCountryArr = [];


    // const test = ["one", "two", "three", "two"]
    // console.log(test);

    for (let i = 0; i < 20; i++) {
      for (let index = 0; index < countriesArr.length; index++) {
        if (countriesArr[index].population === poplutationStat[i]) {
          populationWiseSortedCountryArr.push(countriesArr[index]);
          // console.log(countriesArr[index].latlng);
          console.log(countriesArr[index]);


          break;
        }
      }
    }

    // console.log(populationWiseSortedCountryArr);

    let distance = 0;
    let count = 0;
    for (
      let index = 0;
      index < populationWiseSortedCountryArr.length - 1;
      index++
    ) {

      count += 1;

      if (index === populationWiseSortedCountryArr.length - 1) {
        distance += haversine(
          populationWiseSortedCountryArr[index].latlng,
          populationWiseSortedCountryArr[0].latlng
        );
      } else {
        distance += haversine(
          populationWiseSortedCountryArr[index].latlng,
          populationWiseSortedCountryArr[index + 1].latlng
        );
      }

      // console.log("distance :- " + distance);
      // console.log(populationWiseSortedCountryArr[index].latlng);
      // console.log(populationWiseSortedCountryArr[index + 1].latlng);
    }

    console.log(count);
    console.log(distance.toFixed(2));

    // haversineCalcFormula()

    // poplutationStat.map((countryPopulation) => {

    //   countriesArr.map((countryObj) => {
    //     if (countryObj.population === countryPopulation) {
    //       populationWiseSortedCountryArr.push(countriesArr)
    //       break;
    //     }
    //   })
    // })
  };


  // Haversine formula
  function haversine(coordinationArr1, coordinationArr2) {

    const lat1 = coordinationArr1[0];
    const lon1 = coordinationArr1[1];

    const lat2 = coordinationArr2[0];
    const lon2 = coordinationArr2[1];

    // console.log(lat1, lon1, lat2, lon2);

    const R = 6371;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lon1Rad = (lon1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lon2Rad = (lon2 * Math.PI) / 180;

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = Number(R * c.toFixed(2));
    // const distance = R * c;
    return Number(distance);
  }


  const checkNumer = () => {
    console.log(oData);
  };


  // ans = [132962.77,  149463.66, 158574.19]

  return (
    <div>
      {/* {oData} */}
      <input
        type="number"
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
      />{" "}
      <br /> <br />
      <Button variant="contained" onClick={() => getValFunction(inputData)}>
        submit
      </Button>{" "}
      <br /> <br />
      <Button variant="contained" onClick={() => checkNumer()}>
        Test
      </Button>
    </div>
  );
};

export default Test;
