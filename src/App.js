import React from "react";
import { gql, useLazyQuery } from "@apollo/client";

const ONE_PERSON = gql`
  query SearchPersonInCompany($companyId: ID!, $searchId: ID!, $params: JSON!) {
    company(id: $companyId) {
      id
      name
      search(id: $searchId, params: $params) {
        id
        name
      }
    }
  }
`;

export default function App() {
  const [searchPerson, {
    loading,
    error,
    data
  }] = useLazyQuery(ONE_PERSON);

  const onClick1 = () => {
    searchPerson({
      variables: {
        companyId: 1,
        searchId: 'search-1',
        params: { id: 1 }
      },
      fetchPolicy: 'cache-and-network'
    })
  };

  const onClick2 = () => {
    searchPerson({
      variables: {
        companyId: 1,
        searchId: 'search-2',
        params: { id: 2 }
      },
      fetchPolicy: 'cache-and-network'
    })
  };

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        The cache is attached for inspection at window.apolloCache.
        Clicking one button, then the other, should pop the warning.
      </p>
      <button type="button" onClick={onClick1}>Button #1</button>
      <button type="button" onClick={onClick2}>Button #2</button>
    </main>
  );
}
