# light-validate


This library is intended to facilitate the isolation of validation rules, and to ensure high validation code reuse rate.

### Targets
  - Create Rules
  - Reuse Rules
  - Ensure uniform code
  - Framework Agnostic (functional api)

### Install

```sh
$ npm install -save light-validate
$ npm install -save reflect-metadata
```

### Development and Implementation - Creating Validation Rules (light-rules) ...
Define a mapping to the object that will be processed, requiring the class to follow the data model agreement (interface).
The rule must implement the 'LightRule' class/interface.
```typescript
import { LightRule } from '@light/rule';
export const LightRuleRequired: LightRule = async function (value: any) {
    if(!value){
        throw 'input-required';
    }
}

export const LightRuleNumeric: LightRule = async function (value: string) {
    if (new RegExp('[^0-9]').test(value)) {
        throw 'input-number-only';
    };
}

export const LightRuleLength = function (length: number) {
    return async function (value: string) {
        if(value.length !== length){
            throw 'input-lenght';
        }
    } as LightRule;
}
```

Beginning with version 1.0.2, the LightRule interface is given an optional last parameter, which has its value equivalent to the target object to be validated if you need to create a Rule that depends on a second value of the target object.
```typescript
import { LightRule } from '@light/rule';
export const LightRuleMustNotBeSameThan = function (key: string) {
    return async function (value: string,target:any) {
        if(value===target[key]){
            throw 'input-not-be-same-than';
        }
    } as LightRule;
}
```

### Development and Implementation - Creating Mapping (Classes / Types) ...

#### Important !!!
#### All properties will be decorated with decorator validate, must be initialized with 'undefined' in the class definition, otherwise validation will not work.

```typescript

import { LightRuleRequired } from 'some-place';
import { LightRuleLength } from 'some-place';
import { LightRuleNumeric } from 'some-place';
import { LightValidate } from 'light-validate';

export class UserLightModelMapping  {


    // decorator with rules as ...parameters
    @LightValidate(LightRuleRequired, LightRuleLength(20),LightRuleMustNotBeSameThan('name'))
    username: string = undefined; // all properties decorated with @LightValidate must be initialized with undefined on mapping class, otherwise, validation will not work with the property


    // decorator with rules as ...parameters
    @LightValidate(LightRuleRequired, LightRuleLength(60))  
    name: string = undefined; // all properties decorated with @LightValidate must be initialized with undefined on mapping class, otherwise, validation will not work with the property

    // decorator with rules as ...parameters
    @LightValidate(LightRuleRequired, LightRuleLength(11), LightRuleNumeric)
    document: string = undefined; // all properties decorated with @LightValidate must be initialized with 'undefined' on mapping class, otherwise, validation will not work with the property

}
```

### Development and Implementation - Validation Call ...
```typescript
    import { UserLightModelMapping } from '../some-place';
    import { LightException, validate } from 'light-validate';

    const user:UserLightModelMapping = {
        username:'username-value',  
        password:'name-value', 
        document:'document-value',
    }

    validate(user, UserLightModelMapping)
            .then(() =>{
                // will fall here if no errors are returned.
            })
            .catch((errors: LightException[]) => {
                // will fall here if any errors are returned.
                console.error(errors);
            });
```

# UI libraries for light-validate

## Angular: 

### [light-validate-angular-ui](https://www.npmjs.com/package/light-validate-angular-ui)
    

## Vue
Comming soon...

## React
Comming soon...

## Svelte
Comming soon...