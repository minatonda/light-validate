# light-validate


This library is intended to facilitate the isolation of validation rules, and to ensure high validation code reuse rate.

### Objetivos:
  - Create Rules
  - Reuse Rules
  - Ensure uniform code
  - Framework Agnostic (functional api)

### Instalação

```sh
$ npm install -save light-validate
$ npm install -save reflect-metadata
```

### Development and Implementation - Creating Validation Rules (light-rules) ...
Define a mapping to the object that will be processed, requiring the class to follow the data model agreement (interface).
The rule must implement the 'LightRule' interface.
```typescript
import { LightRule } from '@light/rule';
export const RuleRequired: LightRule = async function (value: any) {
    if(!value){
        throw 'input-required'; // return an error code or message
    }
}

export const RuleOnlyNumber: LightRule = async function (value: string) {
    const error: string[] = [];

    if (new RegExp('[^0-9]').test(value)) {
      throw 'input-number-only'; // return an error code or message
    };
}

export const RuleLength = function (length: number) {
    return async function (value: string) {
        if(value.length !== length){
             throw 'input-lenght'; // return an error code or message
        }
    } as LightRule;
}
```

### Development and Implementation - Creating Mapping (Classes / Types) ...
```typescript

import { RuleRequired } from 'some-place';
import { RuleLength } from 'some-place';
import { RuleOnlyNumber } from 'some-place';
import { LightValidate } from 'light-validate';

export class UserLightModelMapping  {

    // decorator referencing the field to be validated, with the rules to be validated.
    @LightValidate(RuleRequired, RuleLength(60)) 
    username: string = undefined;

    // decorator referencing the field to be validated, with the rules to be validated.
    @LightValidate(RuleRequired) //  
    name: string = undefined;

    // decorator referencing the field to be validated, with the rules to be validated.
    @LightValidate(RuleRequired, RuleLength(11), RuleOnlyNumber)
    document: string = undefined;

}
```

### Development and Implementation - Validation Call ...
```typescript
    import { UserLightModelMapping } from '../some-place';
    import { RuleErrorInterface, validate } from 'light-validate';

    const user:UserLightModelMapping = {
        username:'username-value',  
        password:'name-value', 
        document:'document-value',
    }
    
    // will return a Promise <Object Type sent as target>, with values processed through the    ///////// processing function ....
    // the promise will be resolved if there is no error 
    // (error vector is zero size, or if vector is undefined)
    // a promise will be rejected, if there are any errors, and as a rejection parameter will be sent 
    // a vector of // rule-error-interface, check in the domain folder the data definition
    lightValidate(user, UserLightModelMapping)
            .then(() =>{
                // will fall here if no errors are returned.
            })
            .catch((errors: RuleErrorInterface[]) => {
                // will fall here if any errors are returned.
                console.error(errors);
            });
```
