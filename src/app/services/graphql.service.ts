import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}


  ObtenerClienteFrecuente(phone: any): Observable<any> {
    console.log('Variable '+ phone);
    const LOGIN_MUTATION = gql`query ActiveBenefits($phone: String!) {
  customerLevelByPhone(phone: $phone) {
    ... on GeneralError {
      code
      message
    }
    ... on CustomerLevel {
      customer {
        name
      }
      level {
        name
      }
    }
  }
  gasDiscountByPhone(phone: $phone) {
    ... on GeneralError {
      code
      message
    }
    ... on GasDiscount {
      discount
    }
  }
  getActiveBenefitsByPhone(phone: $phone) {
    ... on ActiveBenefitsByPhone {
      items {
        id
        benefitGenerated {
          name
          externalProductId
          stock
          isActive
          stockUsed
        }
        startDate
        endDate
      }
    }
    ... on GeneralError {
      code
      message
    }
  }
}
    `;
console.log(`query ActiveBenefits($phone: String!) {
  customerLevelByPhone(phone: $phone) {
    ... on GeneralError {
      code
      message
    }
    ... on CustomerLevel {
      customer {
        name
      }
      level {
        name
      }
    }
  }
  gasDiscountByPhone(phone: $phone) {
    ... on GeneralError {
      code
      message
    }
    ... on GasDiscount {
      discount
    }
  }
  getActiveBenefitsByPhone(phone: $phone) {
    ... on ActiveBenefitsByPhone {
      items {
        id
        benefitGenerated {
          name
          externalProductId
          stock
          isActive
          stockUsed
        }
        startDate
        endDate
      }
    }
    ... on GeneralError {
      code
      message
    }
  }
}
    `);
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      fetchPolicy:'no-cache',
      variables: { phone },
    });
  }

  Acumulacion(Numero: any,Estacion:any,Monto:any,Producto:any): Observable<any> {
    const LOGIN_MUTATION = gql`mutation AddAccumulation {
    accumulate(body: {
      productCodename: "${Producto}",
      externalGasStationId: "${Estacion}",
      customerPhone: "${Numero}",
      amount: ${Monto}
    }) {
      __typename
      ... on AccumulationWithBenefits {
      accumulation {
        id
        margin
        customer {
          name
          lastName
          phoneNumber
        }
        points
        product {
          name
          codename
        }
        gasStation {
          name
        }
        generatedPoints
      }
      benefits {
        id
        customer {
          name
          lastName
          
        }
        benefitGenerated {
          name
          stock
          stockUsed
          externalProductId
        }
      }
    }
    ... on GeneralError {
      code
      message
    }
  }
}
    `;
console.log(`mutation AddAccumulation {
    accumulate(body: {
      productCodename: "${Producto}",
      externalGasStationId: "${Estacion}",
      customerPhone: "${Numero}",
      amount: ${Monto}
    }) {
      __typename
      ... on AccumulationWithBenefits {
      accumulation {
        id
        margin
        customer {
          name
          lastName
          phoneNumber
        }
        points
        product {
          name
          codename
        }
        gasStation {
          name
        }
        generatedPoints
      }
      benefits {
        id
        customer {
          name
          lastName
        }
        benefitGenerated {
          name
          stock
          stockUsed
          externalProductId
        }
      }
    }
    ... on GeneralError {
      code
      message
    }
  }
}

    `);
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      fetchPolicy:'no-cache',
      variables: {Numero,Estacion,Producto,Monto},
    });
  }

  RedimeBeneficio(Numero: any,benefitTicketId:any): Observable<any> {
    const LOGIN_MUTATION = gql`mutation RedeemByPhone {
  redemptionByPhone(phone: "${Numero}", benefitTicketId:"${benefitTicketId}") {
    ...on GeneralError {
      code
      message
    }
    ...on Redemption {
      message
    }
  }
}
    `;
console.log(`mutation RedeemByPhone {
  redemptionByPhone(phone: "${Numero}", benefitTicketId:"${benefitTicketId}") {
    ...on GeneralError {
      code
      message
    }
    ...on Redemption {
      message
    }
  }
}
    `);
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      fetchPolicy:'no-cache',
      variables: {Numero,benefitTicketId},
    });
  }



  

}