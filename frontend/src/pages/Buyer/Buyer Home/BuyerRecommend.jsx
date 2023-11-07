import { FrequentlyBoughtTogether } from "@algolia/recommend-react";
import recommend from "@algolia/recommend";
import React, { useEffect, useState } from "react";

const recommendClient = recommend(
  "WYBALSMF67",
  "7f90eaa16b371b16dd03a500e6181427"
);

const indexName = "Item_Index";

function BuyerRecommend(props) {
  //const [totalItems, setTotalItems] = useState([]);

  /* useEffect(() => {
    props.fetchPredictedIds(totalItems);
  }, [totalItems]); */

  function R({ item }) {
    console.log(item.item_id);
    // props.fetchPredictedIds(item);
    //setTotalItems([...totalItems, item]);
  }

  return (
    <FrequentlyBoughtTogether
      recommendClient={recommendClient}
      indexName={indexName}
      objectIDs={props.itemIdForAlgolia}
      itemComponent={R}
    />
  );
}

export default React.memo(BuyerRecommend);
