---
title: Extending the Evaluation Licenses
description: Check activation status and rearm the lab's time-limited Windows evaluations.
---

The lab runs on time-limited evaluations: **180 days** for Windows Server 2025 and **90 days** for Windows 11 Enterprise. Windows includes a built-in tool, `slmgr.vbs`, to check the timer and reset (rearm) it. Each VM has its own timer, so rearming DC01 does nothing for the clients.

All commands below run in a Command Prompt opened **as administrator**, on the VM you are checking.

## Check Activation and Time Remaining

```text
slmgr.vbs /xpr
```

Shows the expiration date. Run this occasionally on each VM, and set a reminder a few days before any of them expire.

The Server evaluation must activate online within 10 days of install or it starts shutting itself down hourly. This normally happens automatically. If `/xpr` says the machine is not activated, confirm it has internet access and run:

```text
slmgr.vbs /ato
```

## Rearm When the Evaluation Is Almost Up

A rearm restarts the evaluation period from the day you run it, and you only get a limited number of them, so wait until the clock is nearly out. To see how many rearms a VM has left:

```text
slmgr.vbs /dlv
```

Look for the remaining rearm count in the dialog. Rearm counts vary by build, so this number is the authority, not anything you read online.

If at least one rearm remains:

1. On DC01, shut down the client VMs first so they are not using domain services mid-reboot. On a client, keep DC01 running.
2. Run:

   ```text
   slmgr.vbs /rearm
   ```

3. Restart the VM.
4. Verify: `slmgr.vbs /ato`, then `slmgr.vbs /xpr`. The expiration date should have moved forward.

If the date did not change or `/rearm` is rejected, do not keep repeating the command. Check that you ran it as administrator and restarted afterward. If the rearm count is zero, that installation cannot be extended: rebuild the VM from fresh evaluation media (or use a licensed edition). For DC01, rebuilding means rebuilding the domain, so plan before its final period runs out.

## What Not to Do

Skip the workarounds you may find online: rolling back the clock, registry hacks, activation tools, or restoring old snapshots to reset the timer. They are unreliable and can break the lab. Rearming and rebuilding are the supported paths.

Microsoft documents the evaluations at the [Windows Server 2025](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025) and [Windows 11 Enterprise](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise) Evaluation Center pages, and the tool itself in the [slmgr.vbs reference](https://learn.microsoft.com/en-us/windows-server/get-started/activation-slmgr-vbs-options).
