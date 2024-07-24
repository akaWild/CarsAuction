import { Auction, AuctionFinished } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { numberWithCommas } from "../lib/numberWithComma";

type Props = {
  finishedAuction: AuctionFinished;
  auction: Auction;
};

function AuctionFinishedToast({ auction, finishedAuction }: Props) {
  return (
    <Link
      href={`/auctions/details/${auction.id}`}
      className="flex flex-col items-center">
      <div className="flex flex-row item-center gap-2">
        <Image
          src={auction.imageUrl}
          alt="image"
          height={80}
          width={80}
          className="rounded-lg w-auto h-auto"
        />
        <div className="flex flex-col">
          <span>
            New Auction! {auction.make} {auction.model} has finished
          </span>
          {finishedAuction.itemSold && finishedAuction.amount ? (
            <p>
              Congrats to {finishedAuction.winner} who has won this auction for $${numberWithCommas(finishedAuction.amount)}
            </p>
          ) : (
            <p>This item was not sold</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default AuctionFinishedToast;
