import { Injectable } from '@angular/core';

import liff from '@line/liff';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  initLineLiff() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1655035990-Jq5yrwMN" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }
  

  initLineLiffProfile() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1655035990-a57dg1Gv" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }

   initLineLiffPoint() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1655035990-wNAvdzXj" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }

  initLineLiffCustomerCrane() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1654982052-R99Pljpz" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }

  
  initLineLiffCustomerTruck() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1654982052-zMWyZxgj" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }

  initLineLiffDriver() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1655035990-96NOoGdB" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }

  initLineLiffProduct() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1655035990-AK64Dg51" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }

  initLineLiffOfferPrice() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1655035990-Wn18w2X9" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }

  initLineLiffOrder() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1655035990-zRNjnwAo" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }

  initLineLiffOrderCustomer() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1654982052-0kZeXGgr" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }

  initLineLiffStarCustomer() {
    return new Promise((resolve, reject) => {
      liff
      .init({
        liffId: "1654982052-Xn2Bodp8" // use own liffId
      })
      .then(() => {
        resolve(liff.getProfile())// Start to use liff's api
      })
      .catch((err) => {
        // Error happens during initialization
        reject(err)
        console.log(err.code, err.message);
      });

    })
  }
}
