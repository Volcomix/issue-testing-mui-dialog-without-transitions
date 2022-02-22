# Issue testing MUI dialog without transitions

Reproduction repo for an issue when testing MUI dialog with the transitions disabled.

## Issue description

When disabling React Transition Group transitions in jest, the `aria-hidden="true"` keeps showing in the (fake) DOM after opening and closing the dialog. This prevents React Testing Library from selecting elements based on accessibility.

This repo is based on MUI [Create React App example with TypeScript](https://github.com/mui/material-ui/tree/master/examples/create-react-app-with-typescript), modified as described bellow:
* added AlertDialog.tsx based on the [Alerts example](https://mui.com/components/dialogs/#alerts) from MUI documentation
* added AlertDialog.test.tsx to test that the dialog can be opened and then closed, letting the open button reachable again
* added React Testing Library
* configured React Transition Group to ["disable" transitions](https://reactcommunity.org/react-transition-group/testing/)
* modified App.tsx to render only `AlertDialog` component

## How to use

To reproduce the issue, run `yarn test --watchAll=false`.

You should get the following error:
```
 FAIL  src/AlertDialog.test.tsx
  ✕ shows the alert dialog (1233 ms)

  ● shows the alert dialog

    Unable to find role="button"

    Ignored nodes: comments, <script />, <style />
    <body
      style="padding-right: 1024px; overflow: hidden;"
    >
      <div
        aria-hidden="true"
      >
        <div>
          <button
            class="MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeMedium MuiButton-outlinedSizeMedium MuiButtonBase-root  css-1rwt2y5-MuiButtonBase-root-MuiButton-root"
            tabindex="0"
            type="button"
          >
            Open alert dialog
            <span
              class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"
            />
          </button>
        </div>
      </div>
    </body>

      20 |
      21 |   expect(
    > 22 |     await screen.findByRole("button", { name: "Open alert dialog" })
         |                  ^
      23 |   ).toBeInTheDocument();
      24 | });
      25 |

      at waitForWrapper (node_modules/@testing-library/dom/dist/wait-for.js:187:27)
      at findByRole (node_modules/@testing-library/dom/dist/query-helpers.js:101:33)
      at Object.<anonymous> (src/AlertDialog.test.tsx:22:18)
      at TestScheduler.scheduleTests (node_modules/@jest/core/build/TestScheduler.js:333:13)
      at runJest (node_modules/@jest/core/build/runJest.js:404:19)
      at _run10000 (node_modules/@jest/core/build/cli/index.js:320:7)
      at runCLI (node_modules/@jest/core/build/cli/index.js:173:3)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.172 s, estimated 3 s
Ran all test suites.
error Command failed with exit code 1.
```

The dialog is closed, the button is there but React Testing Library can't find the button because the top level `div` has the attribute `aria-hidden="true"`.

If you edit setupTests.ts to keep the transitions enabled and replace the test to wait for the modal to disappear before asserting the button presence, the test succeeds.
