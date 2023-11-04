import { FrequentlyBoughtTogether } from '@algolia/recommend-react';
import recommend from '@algolia/recommend';

const recommendClient = recommend('BWO4H6S1WK', '7a3a143223fb1c672795a76c755ef375');
const indexName = 'Item_Index';

function RelatedItem({ item }) {
    console.log(item.item_id); //print 3 item ids careful as sometimes it duplicates ids?
  return (
    <pre>
      {/* <code>{JSON.stringify(item)}</code> */}
    </pre>
  );
}

function App({ currentObjectID }) {
  

  return (
    <FrequentlyBoughtTogether
      recommendClient={recommendClient}
      indexName={indexName}
    //   objectIDs={['kArmV6ZGEqbFkSFQE2rJ']}
      objectIDs={['kArmV6ZGEqbFkSFQE2rJ','lo1O4ZqavkuLJ8T8HaOl']} //u can just do multiple ids like this also if u want to 
      itemComponent={RelatedItem}
      
    />
    
  );
}

export default App;