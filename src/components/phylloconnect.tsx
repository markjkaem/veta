"use client";

import React from "react";
import { Button } from "./ui/button";
import Script from "next/script";

function PhylloConnectIt({
  responseSDK,
  user,
}: {
  user: { id: string };
  responseSDK: { sdk_token: string };
}) {
  const modifyPhyllo = () => {
    const config = {
      clientDisplayName: "Veta app", // the name of your app that you want the creators to see while granting access
      environment: "staging", // the mode in which you want to use the SDK,  `sandbox`, `staging` or `production`
      userId: user.id, // the unique user_id parameter returned by Phyllo API when you create a user (see https://docs.getphyllo.com/docs/api-reference/reference/openapi.v1.yml/paths/~1v1~1users/post)
      token: responseSDK.sdk_token,
    };
    // @ts-ignore
    const phylloConnect = PhylloConnect.initialize(config);

    // phylloConnect.on(
    //   "accountConnected",
    //   // @ts-ignore
    //   (accountId, workplatformId, userId) => {
    //     // gives the successfully connected account ID and work platform ID for the given user ID
    //     console.log(
    //       `onAccountConnected: ${accountId}, ${workplatformId}, ${userId}`
    //     );
    //   }
    // );
    // phylloConnect.on(
    //   "accountDisconnected",
    //   // @ts-ignore
    //   (accountId, workplatformId, userId) => {
    //     // gives the successfully disconnected account ID and work platform ID for the given user ID
    //     console.log(
    //       `onAccountDisconnected: ${accountId}, ${workplatformId}, ${userId}`
    //     );
    //   }
    // );
    // @ts-ignore
    // phylloConnect.on("tokenExpired", (userId) => {
    //   // gives the user ID for which the token has expired
    //   console.log(`onTokenExpired: ${userId}`); // the SDK closes automatically in case the token has expired, and you need to handle this by showing an appropriate UI and messaging to the users
    // });
    // @ts-ignore
    // phylloConnect.on("exit", (reason, userId) => {
    //   // indicates that the user with given user ID has closed the SDK and gives an appropriate reason for it
    //   console.log(`onExit: ${reason}, ${userId}`);
    // });
    // @ts-ignore
    // phylloConnect.on("connectionFailure", (reason, workplatformId, userId) => {
    //   // optional, indicates that the user with given user ID has attempted connecting to the work platform but resulted in a failure and gives an appropriate reason for it
    //   console.log(
    //     `onConnectionFailure: ${reason}, ${workplatformId}, ${userId}`
    //   );
    // });
    phylloConnect.open();
  };

  return (
    <div>
      <Script src="https://cdn.getphyllo.com/connect/v2/phyllo-connect.js" />
      <Button onClick={modifyPhyllo} className="ml-auto mb-4">
        Edit socials{" "}
      </Button>
    </div>
  );
}

export default PhylloConnectIt;
