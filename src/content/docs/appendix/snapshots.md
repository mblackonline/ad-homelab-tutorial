---
title: Snapshot Strategy
description: How to use VirtualBox snapshots as recovery checkpoints while keeping a separate backup of the lab.
---

Snapshots let you return a virtual machine to an earlier state without reinstalling Windows. They are useful before major configuration changes and after verified milestones.

## What a Snapshot Saves

A VirtualBox snapshot preserves the VM's virtual disks and hardware configuration at that moment. VirtualBox then records future disk changes separately, which lets it return to the saved state later.

This guide takes snapshots only after shutting down Windows. A powered-off snapshot is easier to restore and does not depend on a saved copy of the VM's memory.

:::caution
A snapshot is not a backup. Snapshots are stored with the VM on the same host drive. If that drive fails or the VM folder is lost, the snapshots are lost too. Snapshots are convenient recovery points for this disposable homelab, not a production Active Directory backup method.
:::

## Recommended Lab Checkpoints

These are the checkpoints created throughout the guide:

| Module | VM | Snapshot name |
| --- | --- | --- |
| 3 | DC01 | `Clean install - before AD DS` |
| 4 | DC01 | `Domain controller - lab.internal` |
| 5 | DC01 | `DHCP configured` |
| 6 | CLIENT01 | `Domain joined` |
| 7 | DC01 | `AD users groups and share` |
| 7 | CLIENT01 | `Normal domain user tested` |
| 8 | DC01 | `Group Policy configured` |
| 8 | CLIENT01 | `Group Policy applied` |
| 9 | DC01 | `Two clients configured` |
| 9 | CLIENT01 | `RSAT installed` |
| 9 | CLIENT02 | `Domain joined and policies applied` |

You do not need to keep every checkpoint forever. Keep the clean installation, one known-good domain checkpoint, and the latest verified state. Remove redundant snapshots when disk space becomes tight.

## Take a Snapshot

For one VM:

1. Shut down Windows from inside the VM. Do not use **Power Off** in VirtualBox unless Windows is frozen.
2. In VirtualBox Manager, select the VM and open **Snapshots**.
3. Click **Take**.
4. Use a short name that describes the verified state, such as `Before DNS changes`.
5. Add the module number or a brief description if the name alone is not clear.

For a checkpoint involving several VMs:

1. Shut down the clients first.
2. Shut down DC01 last.
3. Take a snapshot of each VM before starting any of them again.
4. Use names that make it clear the snapshots belong to the same stage.

When starting the lab again, start DC01 first. Wait until Windows finishes booting, then start the clients. The clients depend on DC01 for DHCP, DNS, Group Policy, and domain sign-in.

## Restore a Snapshot

Restore a snapshot when a configuration change breaks the lab and reversing the change manually would take longer or be less reliable.

Restoring also discards every file and configuration change made inside that VM after the snapshot. Copy out anything you need before restoring it.

1. Shut down or power off the affected VMs.
2. Select the VM in VirtualBox Manager and open **Snapshots**.
3. Select the checkpoint you want and click **Restore**.
4. VirtualBox may offer to snapshot the current state first. Choose this only if you might need to return to the broken state for troubleshooting.
5. If several VMs are being restored, restore all of them before starting any.
6. Start DC01 first, wait for it to finish booting, then start the clients.

After a restore, verify the basics:

```text
nslookup dc01.lab.internal
```

On a client, also run:

```text
ipconfig /all
```

Confirm DNS points to 10.0.10.10, then test a domain sign-in.

## Restore One VM or the Whole Lab?

Active Directory stores relationships between machines, including a password for each joined computer. Restoring mismatched snapshots can leave one VM expecting objects or credentials that no longer match another VM.

- Restore only a client when the problem is limited to that client's local Windows configuration and its domain trust still works afterward.
- In this single-domain-controller lab, restore only DC01 when undoing a recent server setting and the current client computer accounts still exist. Refresh Group Policy or restart the clients afterward.
- Restore DC01 and the affected clients to matching checkpoints when taking DC01 back past a domain join, password change, or another change that the clients depend on.
- Restore all lab VMs to the same stage when you are unsure which systems were affected.

For example, if you restore DC01 to a snapshot taken before CLIENT01 joined the domain, DC01 no longer has that computer account. CLIENT01 still believes it is joined, so domain trust can fail. Restoring matching checkpoints avoids that mismatch.

## Manage Snapshot Disk Usage

Snapshots are not full copies of the VM, but each one grows as Windows changes files. Windows Update and software installations can make them grow quickly. A long chain also makes the VM harder to manage.

Good habits:

- Keep only checkpoints that have a clear recovery purpose.
- Check free space on the host before major updates or new snapshots.
- Delete obsolete snapshots one at a time and let VirtualBox finish each operation.
- Never delete `.vdi`, `.sav`, or snapshot files manually in File Explorer.

To remove a snapshot, power off the VM, open its Snapshots view, select the unwanted snapshot, and click **Delete**. Deleting a snapshot merges the required disk data and keeps the VM's current state. It does not roll the VM back.

The merge can take several minutes and needs free disk space. Do not close VirtualBox or shut down the host while it runs.

## Back Up the Lab Separately

Snapshots protect against configuration mistakes. A backup protects against losing the VM files or host drive.

For a simple backup:

1. Shut down every VM and close VirtualBox.
2. Copy each complete VM folder to another physical drive.
3. Keep the `.vbox` file, virtual disks, and `Snapshots` folder together.

You can also use **File > Export Appliance** in VirtualBox to create an OVA containing a VM's current state. An export is convenient for archiving or moving a VM, but it does not preserve the full snapshot history.

Whichever method you choose, a backup only counts if it is stored separately from the original and can be restored.

In a production domain, use a supported system-state backup and recovery plan for domain controllers. VM snapshots do not replace that process.

## Quick Rules

- Take a snapshot before a risky change.
- Take another after completing and testing a major stage.
- Shut down Windows before taking lab checkpoints.
- Restore related VMs to matching stages.
- Start DC01 before the clients.
- Delete old snapshots through VirtualBox, never through File Explorer.
- Keep a separate backup of any lab state you cannot easily rebuild.

## Further Learning

- [Oracle VirtualBox: Working with Virtual Machines](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/working-with-vms.html) documents how VirtualBox takes, restores, and deletes snapshots and how appliance exports handle the current VM state.
- [Virtualized Domain Controller Deployment and Configuration](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/virtualized-domain-controller-deployment-and-configuration) explains Microsoft's safeguards and limitations for restoring virtualized domain controllers.
