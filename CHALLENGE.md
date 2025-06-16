# Devices API — Challenge Description

Your task is to develop a REST API capable of persisting and managing **Device** resources.

---

## Device Domain

Each device must contain the following properties:

- `id`: Unique identifier
- `name`: Device name
- `brand`: Device brand
- `state`: Device state — one of:
  - `available`
  - `in-use`
  - `inactive`
- `creationTime`: Timestamp of creation

---

## Supported Functionalities

The API should support the following operations:

- Create a new device
- Fully update an existing device
- Partially update an existing device
- Fetch a single device by ID
- Fetch all devices
- Filter devices by brand
- Filter devices by state
- Delete a device

---

## Domain Validations

- `creationTime` **must not be updated**
- `name` and `brand` **must not be updated** if the device is **in use**
- Devices in `in-use` state **must not be deleted**

---

## Acceptance Criteria

To be considered complete, the solution must meet the following criteria:

- The application **must compile and run successfully**
- The application must include **reasonable test coverage**
- The API must be **well-documented**
- The application must persist data using a **real database** (in-memory storage is **not allowed**)
- The application must be **containerized using Docker**
- The project must be delivered as a **Git repository**
- The repository must contain a `README.md` file with:
  - Setup instructions
  - Usage instructions
  - Any relevant documentation

---

## Requirements

- Language: **TypeScript 5+**

---

## Tips

- Read the entire challenge description and evaluation criteria carefully before starting
- Make granular commits with clear messages
- Include notes about possible improvements or limitations of your implementation

---

## Evaluation Criteria

Your solution will be evaluated based on:

- Implementation of all **acceptance criteria**
- Use of **well-known best practices** and **design patterns**
- **Code quality**, **efficiency**, and **performance**
- Additional features and **production readiness** of the overall solution

---

## Final Notes

- The solution can be submitted as a `.zip` file or hosted on any Git repository platform (GitHub, GitLab, etc.)
