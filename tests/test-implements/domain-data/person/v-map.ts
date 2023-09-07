
export const personAttrsVMap: ValidatorMap<PersonAttrs> = {
  id: new UuidField(),
  govPersonId: new CannotEmptyStringField(true, [new RegexFormatValidationRule(/^[0-9]{12}$/, 'ИИН должен содержать только 12 цифровых символов.')]),
  name: new CannotEmptyStringField(true, [], [new TrimStringLeadRule()]),
  lastName: new CannotEmptyStringField(true, [], [new TrimStringLeadRule()]),
  patronomic: new CannotEmptyStringField(false, [], [new TrimStringLeadRule()]),
};
