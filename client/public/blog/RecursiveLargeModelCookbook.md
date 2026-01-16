# The Recursive Language Model Cookbook: A Guide to Advanced AI Orchestration

---

## TL;DR: How to Use This Cookbook

This guide is for advanced AI users who want to move beyond simple Q&A and get models to perform complex, multi-step reasoning. It is not a magic bullet.

**How to Read This Document:**

1.  **Start with Section 1 (Setting Expectations).** This is the most important part. It explains the critical difference between what is theoretically possible (the RLM paper) and what is practically achievable with today's tools.

2.  **If you use an agent with tools (like Manus AI), go to Section 2.** This section shows you how to implement the RLM framework properly by making the AI write code to analyze external data. This is the most powerful technique in the cookbook.

3.  **If you use standard chatbots (ChatGPT, Claude, Gemini), go to Section 3.** This section provides templates to improve the reasoning and structure of your outputs. It will make your results better, but it will **not** overcome context window limits.

4.  **If you are a developer orchestrating multiple AI agents, go to Section 4.** This section provides a practical, working system for using Claude Code as a project lead to manage a team of specialized AI agents for software development.

In short: read Section 1, then pick the section that matches your use case.

---

## Section 1: Setting Expectations - What These Techniques Can and Cannot Do

This cookbook provides powerful techniques, but it is essential to understand their limitations before you begin.

*   **Simulated vs. True RLM:** The templates for chat-based models (ChatGPT, Claude, Grok, Llama) are **simulations**. They improve reasoning but **do not** overcome context window limitations. Only agents with tool use (Manus AI, or a custom API implementation) can achieve true RLM by externalizing data to a file system.

*   **Tool-Use is Critical:** The RLM framework is fundamentally about programmatic interaction with data. Without the ability to execute code or use tools, an agent can only approximate the process. The quality of the simulation depends heavily on the base model's instruction-following capabilities.

*   **Cost and Latency:** True RLM implementations involve multiple LLM calls, which can increase both cost and latency compared to a single prompt. The goal is to trade a small increase in cost for a massive increase in capability and the ability to solve problems that are otherwise impossible.

*   **Complexity:** This is not a simple prompting technique. It requires you to think like a systems architect, designing a process for the AI to follow. It is best suited for complex, multi-step tasks that justify the additional setup.

---

## Section 2: True RLM Implementation with Manus AI

Manus AI is an agentic framework with direct access to a sandboxed environment (shell, file system, browser). This makes it one of the few platforms where the RLM framework can be implemented **truly**, not as a simulation. The recursion is a real, observable process of tool execution, data manipulation, and self-correction.

This template instructs Manus to act as a proper RLM, programmatically managing context that exists outside its own prompt.

### The Programmatic RLM Agent for Manus AI

This template guides Manus to externalize the context, interact with it via code, and recursively process it to generate a final answer.

**Copy-Paste Template:**

```
# 🤖 PERSONA: RECURSIVE LANGUAGE MODEL (RLM) AGENT

**ROLE:** You are a Recursive Language Model agent. Your task is to answer a complex query by treating the provided context as an external data source that you must interact with programmatically using your available tools (`file`, `shell`). You do not answer directly. You write and execute code to analyze the data and synthesize the answer.

**CORE INSTRUCTIONS:**

1.  **Externalization Phase:** Your first action is to take the entire `Source Context` provided by the user and save it to a file named `context.txt` in the current directory. This moves the data from your prompt into the external environment.

2.  **Planning Phase:** Once the context is externalized, you must create a step-by-step plan to analyze `context.txt` and answer the user's `Complex Query`. This plan must involve writing code (e.g., a Python script or shell commands) to:
    a.  Read `context.txt` in manageable chunks.
    b.  For each chunk, formulate a specific sub-question relevant to the main query.
    c.  Process each chunk to answer its sub-question, saving the intermediate findings to a separate file named `results.md`.

3.  **Execution & Recursion Phase:** Execute your plan step-by-step using your tools. After processing a chunk, read the `results.md` file to evaluate your progress. If a result is insufficient or raises a new question, you must refine your plan and programmatically re-process the relevant chunk of `context.txt` (a recursive step).

4.  **Synthesis & Stop Condition:** Once all chunks have been processed and the `results.md` file contains sufficient information to answer the original query, your final task is to read `results.md` and synthesize its contents into a final, cohesive answer. You MUST signal completion by outputting the final answer wrapped in a `FINAL()` function, like this: `FINAL("This is the complete and final answer.")`

--- 

**USER INPUT:**

**My Complex Query:**
> [Insert your main, complex question here. e.g., "Based on the attached codebase, identify all functions that make API calls and list the endpoints they connect to."]

**Source Context:**
> [Paste your entire large dataset here. This could be multiple code files, reports, etc.]

--- 

**Begin your work by initiating the Externalization Phase.**
```

### Top Use Cases for True RLM

*   **Large-Scale Codebase Analysis:** Provide an entire codebase as context. Ask Manus to identify security vulnerabilities, document all functions, or refactor specific components by programmatically reading and writing to the files.
*   **Multi-Document Analysis:** Provide hundreds of pages of legal documents, financial reports, or research papers. Ask Manus to cross-reference information, find inconsistencies, or synthesize a summary of the entire corpus.
*   **Log File Analysis:** Provide a massive log file. Ask Manus to parse the file, identify all error codes, correlate them with timestamps, and generate a root cause analysis report.

---


---

## Section 3: Simulated Recursive Prompting for Chat Models

For standard chatbots without tool use (like ChatGPT, Claude, Gemini, and Grok), we cannot implement true RLM. However, we can **simulate** the process to achieve more structured and reliable reasoning. This technique forces the model to follow a step-by-step thought process, reducing the likelihood of shallow or inaccurate answers.

### The Universal Simulated RLM Template

This single template can be adapted for most modern chatbots. It combines the best elements of the individual recipes into one universal prompt.

**Copy-Paste Template:**

```
# 🤖 PERSONA: SIMULATED RECURSIVE AGENT

**ROLE:** You are a Simulated Recursive Agent. Your purpose is to systematically deconstruct complex questions and build answers from foundational knowledge. You do not answer directly. You plan, execute, and synthesize.

**CORE INSTRUCTIONS:**

1.  **Decomposition Phase:** Given the user's query, your first action is to break it down into a series of 3-5 logical sub-questions. These are the building blocks of your final answer. Present this as a numbered list.

2.  **Simulated Search & Recursion Phase:** For each sub-question, you will simulate a query to an external knowledge tool (e.g., a search engine or database). Write out the exact, optimized query you would use. Then, using your internal knowledge, provide the answer you would expect to receive from that query.

3.  **Evaluation Loop:** After answering a sub-question, you must ask: "Is this component complete and sufficient?" If the information feels incomplete or raises another question, define a new, more specific sub-question and execute a new simulated search (this is a recursive step).

4.  **Synthesis Phase & Stop Condition:** Once all sub-questions in your plan have been fully addressed and verified, combine all the generated information into a comprehensive, final answer. You MUST signal completion by prefixing your final answer with `[FINAL ANSWER]:`.

--- 

**USER INPUT:**

**My Complex Query:**
> [Insert your main, complex question here.]

--- 

**Begin your work by initiating the Decomposition Phase.**
```

### Model-Specific Tips

*   **For Gemini:** If you can fit your source data into the context window, paste it below the prompt and add: "**Source Context:**
> [Your Data Here]". Instruct Gemini to use this context for its simulated search.
*   **For Grok:** Add a step before Decomposition: "**Real-Time Scan:** First, perform a simulated search on the X platform for real-time sentiment and news related to the query."
*   **For Claude:** You can lean into its constitutional nature by adding: "Ensure your final answer is structured, well-reasoned, and avoids speculation."

### Bonus Templates for Specific Tasks

These are variations of the universal template, tailored for common professional tasks.

*   **The Recursive Data Analyst:** For analyzing datasets. Add a "Data Understanding Phase" at the beginning to describe the data structure.
*   **The Recursive Troubleshooter:** For debugging. Replace the phases with: 1. Problem Definition, 2. Hypothesis Generation, 3. Hypothesis Testing & Recursion, 4. Resolution.
*   **The Recursive Content Strategist:** For marketing. Replace the phases with: 1. Audience & Goal Analysis, 2. Framework Decomposition, 3. Component Drafting & Recursion, 4. Synthesis & Polish.

---

## Section 4: The Triad Architecture - A Multi-Agent Development Framework

While the recursive prompting techniques are powerful for single-agent workflows, true efficiency in complex software development and research is achieved through **task specialization**. The Triad Architecture is a framework for orchestrating a team of specialized AI agents, where each agent is chosen for its unique strengths, optimizing for cost, speed, and quality.

This architecture positions a highly capable reasoning model as the **Lead Architect** or **Project Lead**. This lead agent does not perform all the work itself. Instead, it deconstructs a complex project into sub-tasks and delegates them to a team of specialized sub-agents. This mimics a real-world engineering team, where a senior architect guides the work of researchers, junior developers, and other specialists.

### The Core Principle: Delegate by Default

The central rule of the Triad Architecture is **Delegate by Default**. The Lead Architect's primary role is to analyze a problem and ask: "Who is the best agent for this job?" By offloading tasks to more efficient or specialized models, the Lead Architect conserves its own expensive context window and processing power for the most critical tasks: planning, analysis, and synthesis.

This section provides a robust framework for implementing this architecture using **Claude Code** as the Lead Architect. This architecture is a practical, real-world implementation of the RLM paper's theoretical model. The Lead Architect acts as the root RLM, and the `triad` CLI commands serve as the `llm_query()` function, allowing the lead agent to recursively call specialized sub-agents to process data and process data that exists outside its own context.

### The Cast of Agents: Your AI Development Team

This framework utilizes four distinct roles, each with a specific purpose:

| Role | Agent | Primary Function | Strengths |
| :--- | :--- | :--- | :--- |
| **Lead Architect** | **Claude Code** (Main Instance) | **Orchestration & Synthesis:** Decomposes tasks, delegates work, and integrates the results. | Superior reasoning, planning, and code analysis capabilities. The "brains" of the operation. |
| **The Researcher** | **Gemini CLI** | **Bulk Data Ingestion:** Reads and summarizes massive documents, codebases, or datasets. | Enormous context window (1M+ tokens), ideal for tasks that would overwhelm other models. |
| **The Junior Engineer** | **OpenCode** | **Boilerplate & Scripts:** Generates standard, repetitive code, unit tests, and simple scripts. | Fast, cost-effective, and efficient at generating common code patterns. |
| **The Sr. Engineer** | **Claude Code** (Subprocess) | **Complex Component Development:** Handles discrete, complex coding tasks that require strong reasoning but should be isolated from the main project context. | Strong coding and reasoning abilities, perfect for tackling complex functions or modules in a clean environment. |

---

### Orchestration Setup: The Python `triad` CLI

To make this architecture robust and easy to use, we will move beyond simple bash aliases and create a Python-based command-line interface (CLI) tool. This tool, which we will call `triad`, will manage the initialization of your Lead Architect (Claude Code) and provide a structured way to invoke your sub-agents.

This approach is more powerful than aliases because it can handle complex logic, manage state, and provide a much cleaner user experience.

#### Step 1: Configure Your CLI Commands

Before creating the script, ensure you have CLI access to your AI models. The script assumes the following commands exist:

- `gemini` - Gemini CLI (install via `pip install google-generativeai` or your preferred method)
- `opencode` - OpenCode CLI (install per OpenCode documentation)
- `claude-code` - For Claude Code subprocess, you have several options:
  - Use the Claude API directly via Python (recommended)
  - Create a wrapper script that spawns a new terminal session
  - Use an alternative CLI tool like `claude-cli` if available

If your commands have different names, update lines 192-194 in the script below to match your setup.

#### Step 2: Create the `triad` Script

Save the following Python code to a file named `triad.py` in a directory that is included in your system's PATH (e.g., `/usr/local/bin`). This will make the `triad` command available from anywhere in your terminal.

**`/usr/local/bin/triad.py`**
```python
#!/usr/bin/env python3
import subprocess
import argparse
import os

# --- Configuration ---
# Ensure these commands match how you invoke your models.
# You might use aliases defined in your .bashrc or .zshrc.
GEMINI_CMD = "gemini"
OPENCODE_CMD = "opencode"
CLAUDE_CMD = "claude-code" # Assuming you have an alias for the Claude Code CLI

# --- System Override Prompt ---
SYSTEM_OVERRIDE_PROMPT = """
# 🤖 SYSTEM OVERRIDE: THE TRIAD ARCHITECTURE

**Role:** You are the **Lead Architect & Orchestrator**. Your primary function is to achieve the user's objective by intelligently delegating tasks to your specialized sub-agents. You must optimize for token efficiency and context window management.

**Your Team (Sub-Agents):**
You have access to three specialized sub-agents. You must delegate tasks to them rather than doing everything yourself. You can invoke them using the `triad` command-line tool.

1.  **🔵 The Researcher (Gemini CLI):**
    *   **Use Case:** Reading and summarizing massive documents, analyzing large codebases, or any task requiring a huge context window.
    *   **Invocation:** `triad research "Your detailed prompt for Gemini"`

2.  **🟢 The Junior Engineer (OpenCode):**
    *   **Use Case:** Generating boilerplate code, writing unit tests, creating simple scripts, or any repetitive coding task.
    *   **Invocation:** `triad build "Your detailed prompt for OpenCode"`

3.  **⚫ The Sr. Engineer (Claude Code Subprocess):**
    *   **Use Case:** Developing complex, isolated components or functions that require strong reasoning but should not pollute your main working context.
    *   **Invocation:** `triad engineer "Your detailed prompt for a new Claude instance"`

**⚙️ OPERATIONAL RULES:**
1.  **Decompose:** Break every user request into a clear sequence of sub-tasks.
2.  **Delegate by Default:** For each task, ask "Who is the best agent for this job?" and use the `triad` tool to delegate.
3.  **Synthesize:** Your primary job is to review the outputs from your sub-agents, integrate their work, and orchestrate the overall project to completion.

**Acknowledge this structure and await the Mission Brief.**
"""

# --- Mission Brief Template ---
MISSION_BRIEF_TEMPLATE = """
### 🚀 MISSION BRIEF

**Objective:**
> {objective}

**Required Deliverables:**
{deliverables}

**Execution Strategy (Initial Thoughts):**
*   **Research:** Use `triad research` for all large-scale information gathering.
*   **Building:** Use `triad build` for initial code scaffolding and repetitive tasks.
*   **Complex Logic:** Use `triad engineer` for complex, self-contained components.
*   **Orchestration:** As the Lead Architect, you will review all outputs and integrate the final solution.

**Begin your work by creating a step-by-step execution plan.**
"""

def run_command(command):
    """Runs a command in the shell and prints its output in real-time."""
    try:
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())
        rc = process.poll()
        return rc
    except Exception as e:
        print(f"An error occurred: {e}")
        return 1

def main():
    parser = argparse.ArgumentParser(description="A CLI tool to orchestrate a triad of AI agents.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # 'init' command
    parser_init = subparsers.add_parser('init', help='Prints the System Override prompt for the Lead Architect (Claude Code).')
    parser_init.set_defaults(func=lambda args: print(SYSTEM_OVERRIDE_PROMPT))

    # 'mission' command
    parser_mission = subparsers.add_parser('mission', help='Generates a structured Mission Brief.')
    parser_mission.add_argument('objective', type=str, help='The main objective for the mission.')
    parser_mission.add_argument('-d', '--deliverables', nargs='*', default=[], help='A list of required deliverables.')
    parser_mission.set_defaults(func=lambda args: print(MISSION_BRIEF_TEMPLATE.format(
        objective=args.objective,
        deliverables='\n'.join([f'{i}. {d}' for i, d in enumerate(args.deliverables, 1)]) or '1. Final integrated solution.'
    )))

    # 'research' command
    parser_research = subparsers.add_parser('research', help='Delegates a task to the Researcher (Gemini CLI).')
    parser_research.add_argument('prompt', type=str, help='The prompt to send to the research agent.')
    parser_research.set_defaults(func=lambda args: run_command(f'{GEMINI_CMD} "{args.prompt}"'))

    # 'build' command
    parser_build = subparsers.add_parser('build', help='Delegates a task to the Junior Engineer (OpenCode).')
    parser_build.add_argument('prompt', type=str, help='The prompt to send to the build agent.')
    parser_build.set_defaults(func=lambda args: run_command(f'{OPENCODE_CMD} "{args.prompt}"'))

    # 'engineer' command
    parser_engineer = subparsers.add_parser('engineer', help='Delegates a task to the Sr. Engineer (Claude Code subprocess).')
    parser_engineer.add_argument('prompt', type=str, help='The prompt to send to the engineer agent.')
    parser_engineer.set_defaults(func=lambda args: run_command(f'{CLAUDE_CMD} "{args.prompt}"'))

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()

```

#### Step 3: Make the Script Executable

After saving the file, you need to give it execute permissions. Run the following command in your terminal:

```bash
chmod +x /usr/local/bin/triad.py
```

---

### The Triad Workflow: A Step-by-Step Guide

Here is the complete workflow for using the `triad` CLI to manage your AI development team.

#### Step 1: Initialize the Lead Architect

Begin your session by starting your main Claude Code instance. Your very first command should be to initialize the Triad Architecture. This injects the system prompt and programs Claude to act as your Lead Architect.

```bash
# In your terminal, run:
triad init
```

This command will print the **System Override** prompt to your screen. **Copy the entire output and paste it as your first input to Claude Code.** Claude should respond with an acknowledgment, confirming it understands its role and the team structure. Your orchestrator is now ready.

#### Step 2: Define the Mission

Next, you need to give your Lead Architect its assignment. Use the `triad mission` command to generate a structured brief. This ensures your objectives and deliverables are clearly communicated.

```bash
# In your terminal, run:
triad mission "Build a web scraper to get headlines from Hacker News" -d "A Python script that saves headlines to headlines.csv" "A requirements.txt file"
```

This command will generate a **Mission Brief**. **Copy the entire output and paste it as your next input to Claude Code.**

#### Step 3: Orchestrate the Execution

Now, the interactive part begins. Claude, as the Lead Architect, will receive the Mission Brief and create a step-by-step plan. It will then use the `triad` commands in its responses to delegate the tasks. Your job is to facilitate this process.

Here is an example of how the conversation might unfold:

**Claude Code (Lead Architect):**
> Understood. I will now create a plan to build the Hacker News scraper.
> 
> **Execution Plan:**
> 1.  First, I need to understand the HTML structure of the Hacker News homepage. I will delegate this research task to the Researcher.
> 2.  Next, the Junior Engineer will generate a basic Python script with `requests` and `BeautifulSoup` to fetch the page.
> 3.  Then, the Sr. Engineer will write the core parsing logic to extract the headlines.
> 4.  Finally, I will integrate all parts and add the CSV writing functionality.
> 
> Starting with step 1.
> 
> ```bash
> triad research "Analyze the HTML structure of https://news.ycombinator.com and identify the tags and classes for the main headlines."
> ```

**Your Role (The Human Operator):**

You see Claude's plan and the command it wants to run. You simply **copy the `triad research ...` command from Claude's output and run it in your terminal.** The Gemini CLI will execute, and its findings will be printed to the screen.

**Claude Code (Lead Architect):**
> Excellent. The Researcher has identified that headlines are in `<span>` tags with the class `titleline`. Now, I will have the Junior Engineer create the initial script.
> 
> ```bash
> triad build "Create a Python script named scraper.py that uses requests to fetch 'https://news.ycombinator.com' and includes boilerplate for BeautifulSoup parsing."
> ```

Again, you copy the `triad build...` command and run it. OpenCode generates the `scraper.py` file.

This cycle continues until the project is complete. You act as the bridge, executing the commands that the Lead Architect delegates.

---

## Appendix A: Quick Reference Card

This card provides a quick summary of the key commands and concepts for easy reference.

### Triad CLI Commands

| Command | Description |
| :--- | :--- |
| `triad init` | Prints the System Override prompt to initialize the Lead Architect. |
| `triad mission "<objective>" -d "<deliverable>"` | Generates a structured Mission Brief. |
| `triad research "<prompt>"` | Delegates a task to the Researcher (Gemini CLI). |
| `triad build "<prompt>"` | Delegates a task to the Junior Engineer (OpenCode). |
| `triad engineer "<prompt>"` | Delegates a task to the Sr. Engineer (Claude Code subprocess). |

### Agent Selection Guide

| If your task involves... | ...then use this agent: |
| :--- | :--- |
| Analyzing massive documents or codebases | **The Researcher (Gemini CLI)** |
| Writing boilerplate code or simple scripts | **The Junior Engineer (OpenCode)** |
| Developing complex, isolated functions | **The Sr. Engineer (Claude Code)** |
| Planning, orchestrating, and synthesizing | **The Lead Architect (Claude Code)** |

---

## References

[1] Y. Wu, et al. (2025). *Recursive Language Models*. arXiv:2512.24601. Available: https://arxiv.org/pdf/2512.24601
