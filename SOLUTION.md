


# Solution Overview & Debugging Notes

This document outlines the design decisions, trade-offs, and a real debugging issue encountered during development.


## Architecture Overview

### Backend
- Layered architecture (Controller → Service → Repository)
- EF Core InMemory database for simplicity and fast setup
- Global exception handling returning RFC 7807 `ProblemDetails`
- Strong enum usage for task status and priority

### Frontend
- Single `TasksComponent` handling:
  - Task list
  - Create/Edit modal
  - Search & sorting
- Reactive Forms used for strong validation and testability
- API interaction abstracted via `TaskService`

## Design Trade-offs

- InMemory DB chosen instead of a real database to reduce setup complexity and focus on API correctness.
- Single Angular component used instead of splitting into multiple components to keep scope manageable within the time constraint.

## Debugging Issue Encountered

### Issue
When submitting a new task from the Angular frontend, the API returned a `400 Bad Request error`, even though the form appeared valid.

### Error Response

json
{
  "errors": {
    "$.status": [
      "The JSON value could not be converted to LexisApi.Utilities.StatusTask."
    ]
  }
}

##Solution
I had to add a `JsonStringEnumConverter` to solve that in the Program.cs

builder.Services.AddControllers().AddJsonOptions(options =>
  {
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()
  );
});
