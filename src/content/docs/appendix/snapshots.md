---
title: Snapshot Strategy
description: Use clean-build VirtualBox snapshots without rolling Active Directory backward.
---

A VirtualBox snapshot saves a VM's disks and configuration at one point in time. Restoring it returns the entire VM to that earlier state and discards later changes.

:::caution
Use snapshots only as clean-build checkpoints before a server becomes a domain controller or a client joins the domain. After domain setup begins, fix configuration mistakes forward instead of using snapshots to roll machines back.
:::

This rule keeps the lab simple. Active Directory stores changing information about its computers and accounts. Restoring one domain-connected VM to an older state can leave it out of sync with the rest of the lab.

## Keep These Clean-Build Snapshots

The guide creates only these checkpoints:

| Module | VM | Snapshot name |
| --- | --- | --- |
| 3 | DC01 | `Clean install - before AD DS` |
| 6 | CLIENT01 | `Clean install - before domain join` |
| 9 | CLIENT02 (optional) | `Clean install - before domain join` |

Each checkpoint is taken after Windows Update and Guest Additions, but before the VM has an Active Directory role or relationship.

## Take a Clean-Build Snapshot

1. Shut down Windows from inside the VM. Do not use **Power Off** in VirtualBox unless Windows is frozen.
2. In VirtualBox Manager, select the VM and open **Snapshots**.
3. Click **Take**.
4. Enter the name shown in the table above.

Do not create additional snapshots after DC01 is promoted or after a client joins the domain.

## Fix Forward After Domain Setup

If a DHCP option, user, group, permission, or GPO is wrong, correct or recreate that item. Troubleshooting and repairing these changes is part of the lab.

If a client develops a trust problem but Windows still works, follow the repair steps in the [Troubleshooting appendix](/appendix/troubleshooting/) instead of restoring a domain-joined snapshot.

## Rebuild a Client from Its Clean Snapshot

If a client becomes unusable:

1. On DC01, delete that client's old computer object from **Lab Computers** or the built-in **Computers** container.
2. Shut down the client and restore its `Clean install - before domain join` snapshot in VirtualBox.
3. Start the client and repeat the networking and domain-join steps from its module.
4. Move the new computer object into **Lab Computers** when required.

Restoring the snapshot removes every file and setting created on that client afterward. Copy out anything you need first if the VM is still usable.

## Rebuild an Unusable DC01

The DC01 snapshot is a start-over point, not a way to undo one domain change. If DC01 becomes unusable:

1. Shut down the clients.
2. Restore DC01 to `Clean install - before AD DS`.
3. Repeat the server and domain configuration modules.
4. Restore each client to its clean pre-join snapshot, then join it to the rebuilt domain.

This rebuild discards the current lab domain. Use it only when fixing DC01 forward is no longer practical.

## Snapshots Are Not Backups

Snapshots are stored with the VM on the same host drive. If that drive or VM folder is lost, its snapshots are lost too.

For a simple separate backup:

1. Shut down every VM and close VirtualBox.
2. Copy each complete VM folder to another physical drive.
3. Keep the `.vbox` file, virtual disks, and `Snapshots` folder together.

You can also use **File > Export Appliance** in VirtualBox to archive a VM's current state. An export does not preserve its snapshot history.

Delete snapshots only through VirtualBox, never by removing snapshot files in File Explorer. In a production domain, use a supported system-state backup and recovery plan for domain controllers. VM snapshots do not replace that process.

## Further Learning

- [Oracle VirtualBox: Working with Virtual Machines](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/working-with-vms.html) documents how VirtualBox takes, restores, and deletes snapshots.
- [Oracle VirtualBox: Troubleshooting](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/Troubleshooting.html) includes the domain-membership problem that can occur after restoring an older Windows client snapshot.
- [Virtualized Domain Controller Deployment and Configuration](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/virtualized-domain-controller-deployment-and-configuration) explains Microsoft's safeguards and limitations for virtualized domain controller recovery.
