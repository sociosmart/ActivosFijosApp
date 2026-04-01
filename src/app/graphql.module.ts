import { NgModule } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { setContext } from '@apollo/client/link/context'; // Importar setContext
//const uri = 'http://165.232.153.39:8050/graphql'; // Cambia esto con la URL de tu servidor GraphQL
const uri = 'https://api.lealtadsmartgas.xyz/graphql'; // Cambia esto con la URL de tu servidor GraphQL
export function createApollo(httpLink: HttpLink) {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
      //TESTING
     //  'X-APP-KEY': '4bd543ee-1880-405b-a876-354062984b60',
     //  'X-API-KEY': '8fa8abd6-df1b-4164-9c9d-bd967a19152d',
      //PRODUCCION
      'X-APP-KEY': 'bec55074-0e54-420a-bae6-f99fad7fc9c5',
      'X-API-KEY': 'c11f2acf-c7ae-4f4d-8744-609f39801a4b',
      },
    };
  });

  return {
    link: authLink.concat(httpLink.create({ uri })), // Combina el authLink con httpLink
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
