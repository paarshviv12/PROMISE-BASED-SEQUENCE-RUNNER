# PROMISE-BASED-SEQUENCE-RUNNER

A modern, interactive Promise-based sequence runner built with JavaScript, HTML, and CSS. 

This project explores strict sequential execution of asynchronous tasks using JavaScript's native Promises and `async/await`. It guarantees that each task in an array waits for the previous one to fully resolve before it starts, preserving order and aggregating results.

## How It Works (Flowchart)

Below is a flowchart detailing the logic of the strict sequential runner algorithm:

```mermaid
graph TD
    A([Start Sequence Runner]) --> B[Initialize Results Array]
    B --> C{Are there tasks<br/>remaining?}
    
    C -- Yes --> D[Get Next Task]
    D --> E["Start Task Execution (State: Active)"]
    E --> F{"Did Task Resolve Successfully?"}
    
    F -- Yes --> G["Store Result in Array (State: Done)"]
    G --> C
    
    F -- No --> H["Catch Error (State: Failed)"]
    H --> I[Halt Execution Sequence]
    I --> J(["Throw Error / Abort Sequence"])
    
    C -- No --> K[Return All Aggregated Results]
    K --> L(["Sequence Completed Successfully"])
```

## Features
- **Strict Ordering:** Ensures asynchronous operations execute one after the other.
- **Error Handling:** If any task fails, the entire sequence stops, preventing subsequent tasks from running in an invalid state.
- **Live UI Feedback:** Real-time visual updates showing tasks as `Pending`, `Running...`, `Completed`, or `Failed`.
- **Built-in Terminal UI:** Logs execution status, timestamps, and aggregated results directly in the browser.

## Getting Started
Simply open `index.html` in your favorite web browser to view and interact with the Live Promise Runner!