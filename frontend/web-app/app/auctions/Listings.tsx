"use client";

import { Auction, PagedResult } from "@/types";
import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { useEffect, useState } from "react";
import { getData } from "../actions/auctionActions";
import Filters from "./Filters";
import { useParamsStore } from "@/hooks/useParamsStore";
import { shallow } from "zustand/shallow";
import qs from "query-string";

function Listings() {
  const [data, setData] = useState<PagedResult<Auction>>();
  const params = useParamsStore(
    (state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
    }),
    shallow
  );
  const setParams = useParamsStore((state) => state.setParams);
  const url = qs.stringifyUrl({ url: "", query: params });

  function setPageNumber(pageNumber: number): void {
    setParams({ pageNumber });
  }

  useEffect(() => {
    getData(url).then((data) => {
      setData(data);
    });
  }, [url]);

  if (!data) return <h3>Loading...</h3>;

  return (
    <>
      <Filters />
      <div className="grid grid-cols-4 gap-6">
        {data.results.map((auction) => (
          <AuctionCard
            auction={auction}
            key={auction.id}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <AppPagination
          currentPage={params.pageNumber}
          pageCount={data.pageCount}
          pageChanged={setPageNumber}
        />
      </div>
    </>
  );
}

export default Listings;
