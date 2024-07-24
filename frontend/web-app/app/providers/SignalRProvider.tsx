"use client";

import { useAuctionStore } from "@/hooks/useAuctionStore";
import { useBidStore } from "@/hooks/useBidStore";
import { Bid } from "@/types";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

function SignalRProvider({ children }: Props) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const setCurentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addBid = useBidStore((state) => state.addBid);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder().withUrl("http://localhost:6001/notifications").withAutomaticReconnect().build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to notification hub");

          connection.on("BidPlaced", (bid: Bid) => {
            if (bid.bidStatus.includes("Accepted")) {
              setCurentPrice(bid.auctionId, bid.amount);
            }

            addBid(bid);
          });
        })
        .catch((error) => console.log(error));
    }

    return () => {
      connection?.stop();
    };
  }, [connection, setCurentPrice]);

  return children;
}

export default SignalRProvider;
