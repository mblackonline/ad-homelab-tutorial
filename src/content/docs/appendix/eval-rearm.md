---
title: Extending the Evaluation Licenses
description: How to rearm the Windows Server and Windows 11 evaluation periods for long-term lab use.
---

The lab uses time-limited evaluation editions: 180 days for Windows Server 2025 and 90 days for Windows 11 Enterprise. Windows includes the Software Licensing Management Tool, `slmgr.vbs`, which shows the current license state and can reset the evaluation timer when that installation has a rearm available.

| Operating system | Initial evaluation period |
| --- | --- |
| Windows Server 2025 Evaluation | 180 days |
| Windows 11 Enterprise Evaluation | 90 days |

Each VM has its own timer. Rearming DC01 does not extend CLIENT01 or CLIENT02.

:::caution
Do not rearm immediately after installation. A rearm resets the timer from the day you run it and uses one of the available rearms. Wait until the current evaluation is close to expiring.
:::

## Complete the Initial Online Activation

The Windows Server evaluation must complete online activation within 10 days of installation. Activation starts its full 180-day evaluation period. The evaluation media already contains the required key, so you do not need to enter one.

DC01 normally activates itself through the ADLab internet connection. To check it manually:

1. Sign in to DC01 as `LAB\Administrator`.
2. Open Command Prompt as administrator.
3. Run:

   ```text
   slmgr.vbs /xpr
   ```

4. Wait for the Windows Script Host dialog. It should show the evaluation expiration date.

If Windows has not activated, confirm DC01 can reach the internet and run:

```text
slmgr.vbs /ato
```

Run `slmgr.vbs /xpr` again after activation completes. Do this before the initial 10-day window ends. An unactivated or expired evaluation can begin shutting down every hour.

## Check the Remaining Time and Rearm Count

Run these checks locally on each VM. Open Command Prompt as administrator and enter:

```text
slmgr.vbs /dlv
```

The detailed license dialog includes:

- The installed edition and evaluation channel
- License status
- Time remaining
- Remaining Windows rearm count

You can also run this shorter command whenever you only need the expiration date:

```text
slmgr.vbs /xpr
```

The rearm count reported by `slmgr.vbs /dlv` is the authority for that VM. Counts can vary by evaluation build and by whether the VM was previously rearmed or generalized. If the remaining count is zero, `slmgr.vbs /rearm` cannot extend it again.

## Rearm Windows Server 2025

Plan a short outage because DC01 must restart. Shut down the client VMs first so they are not trying to use domain services during the reboot.

1. On DC01, open Command Prompt as administrator.
2. Run `slmgr.vbs /dlv` and confirm at least one rearm remains.
3. Run:

   ```text
   slmgr.vbs /rearm
   ```

4. Wait for the success message, then restart DC01.
5. After the restart, confirm internet access and run:

   ```text
   slmgr.vbs /ato
   ```

6. Verify the new status:

   ```text
   slmgr.vbs /dlv
   slmgr.vbs /xpr
   ```

7. Start CLIENT01 and CLIENT02 only after DC01 finishes booting.

The remaining rearm count should decrease, and the expiration date should move forward. If it does not, do not keep repeating the command. Check the troubleshooting section below.

## Rearm Windows 11 Enterprise Evaluation

Repeat the process separately on CLIENT01 and CLIENT02. DC01 must be running so domain sign-in and DNS continue to work.

1. Sign in to the client and open Command Prompt as administrator.
2. Run `slmgr.vbs /dlv` and check the remaining rearm count.
3. If a rearm remains, run:

   ```text
   slmgr.vbs /rearm
   ```

4. Restart the client.
5. After the restart, run:

   ```text
   slmgr.vbs /ato
   slmgr.vbs /xpr
   ```

Windows 11 evaluation releases are limited to 90 days initially, and rearm availability can differ between builds. If `/dlv` shows zero remaining rearms or `/rearm` is rejected, the supported choices are to reinstall a fresh evaluation or use a properly licensed Windows edition that can join the domain.

## If Rearm Fails

### You Must Run the Command as Administrator

Close Command Prompt, search for it again, right-click it, and choose **Run as administrator**. Enter `LAB\Administrator` credentials on a client if prompted.

### The Rearm Count Is Zero

The installation has used all rearms available to its evaluation license. Back up anything you need, then either rebuild the VM from current evaluation media or replace it with a licensed edition.

For DC01, rebuilding means recreating the domain unless you have a suitable system backup. Plan before its final evaluation period expires.

### Activation Does Not Complete

Confirm the VM has the correct network settings and internet access:

```text
ipconfig /all
nslookup www.microsoft.com
```

DC01 should use 10.0.10.10 as its own DNS server and have a working DNS forwarder. Clients should use only 10.0.10.10 for DNS. Correct the connection, then retry `slmgr.vbs /ato`.

### The New Expiration Date Does Not Appear

Confirm you restarted after `/rearm`, then run `/ato` and check `/xpr` again. If `/dlv` shows the rearm count decreased but the evaluation period did not reset, stop and record the full error message or license status before making more changes.

## What Not to Do

- Do not change the system clock to avoid expiration.
- Do not use registry hacks or third-party activation tools.
- Do not repeatedly restore old snapshots to reset the timer. Snapshots are for recovering configuration, not bypassing licensing.
- Do not use a rearm while most of the current evaluation period remains.

These methods are unreliable, can damage the lab, and do not create a valid license.

## Plan Ahead

Check `slmgr.vbs /xpr` occasionally and set a calendar reminder several days before each VM expires. Keep the original ISO files and document the current rearm count for DC01, CLIENT01, and CLIENT02.

Microsoft's current evaluation terms and durations are available from the [Windows Server 2025 Evaluation Center](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025) and the [Windows 11 Enterprise Evaluation Center](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise). Microsoft documents the supported `slmgr.vbs` options in [Slmgr.vbs options for obtaining volume activation information](https://learn.microsoft.com/en-us/windows-server/get-started/activation-slmgr-vbs-options).
