/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

/* eslint-env browser */
/* eslint-disable no-console */

'use strict';

declare var __DEV__: boolean;

const injectUpdate = require('./injectUpdate');

function registerServiceWorker(swUrl: string) {
  const serviceWorker = navigator.serviceWorker;

  if (!serviceWorker) {
    if (__DEV__) {
      console.info('ServiceWorker not supported');
    }

    return;
  }

  window.addEventListener('load', function() {
    const registrationPromise = serviceWorker.register(swUrl);

    if (__DEV__) {
      registrationPromise.then(
        registration => {
          console.info(
            'ServiceWorker registration successful with scope: ',
            registration.scope,
          );
        },
        error => {
          console.error('ServiceWorker registration failed: ', error);
        },
      );

      serviceWorker.addEventListener('message', (event: MessageEvent) => {
        const data = event.data;

        if (!(data instanceof Object) || typeof data.type !== 'string') {
          return;
        }

        switch (data.type) {
          case 'METRO_UPDATE_START': {
            console.info('Metro update started.');
            break;
          }
          case 'METRO_UPDATE': {
            console.info('Injecting metro update:', data.body);
            injectUpdate(data.body);
            break;
          }
          case 'METRO_UPDATE_ERROR': {
            console.error('Metro update error: ', data.error);
            break;
          }
        }
      });
    }
  });
}

module.exports = registerServiceWorker;
