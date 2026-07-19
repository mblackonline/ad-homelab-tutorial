---
title: "Module 4: Promote to Domain Controller"
description: Install Active Directory Domain Services and create your first forest.
---

This is the module where the lab becomes an Active Directory lab. You will install the Active Directory Domain Services (AD DS) role on DC01 and promote it to a domain controller, creating a brand new domain.

## In This Module

- Install the Active Directory Domain Services role
- Choose a domain name for your lab (and why the name matters)
- Promote DC01 to a Domain Controller, creating a new forest
- Verify DNS is working
- Take a snapshot

## A Few Terms First

- **Domain:** a group of computers and users managed together under one set of accounts and rules. Your lab domain will contain DC01 and the clients you build later.
- **Domain Controller (DC):** a server that stores the domain's database of users, computers, and passwords, and answers login requests. DC01 becomes one in this module.
- **Forest:** the top-level container in Active Directory. A forest can hold many domains, but most small networks (and this lab) have exactly one.

## Choose a Domain Name

This guide uses **`lab.internal`**.

The name matters more than beginners expect, because it is hard to change later. Two quick rules:

- Do not use a domain you do not own, like `mycompany.com`, because your lab DNS would hijack the real site.
- Do not use `.local`. It looks tempting, but that ending is reserved for a different technology (mDNS, used by devices like printers and Apple products) and causes odd name resolution problems.

The `.internal` ending is officially reserved for private networks, so it can never conflict with a real internet domain. That makes `lab.internal` a safe, correct choice. If you prefer a different first part, like `homelab.internal`, that is fine. Just substitute your name everywhere this guide says `lab.internal`.

## Install the AD DS Role

1. On DC01, open **Server Manager** (it usually opens at login; otherwise it is in the Start menu).
2. Click **Manage > Add Roles and Features**.
3. Click Next through the first screens, keeping the defaults (Role-based installation, DC01 selected as the destination).
4. On the Server Roles screen, check **Active Directory Domain Services**. A window pops up asking to add required features. Click **Add Features**.
5. Click Next through the remaining screens and click **Install**. You can close the wizard while it runs. Wait for the installation to finish.

Installing the role only copies the software onto the server. DC01 is not a domain controller until the next step.

## Promote DC01 to a Domain Controller

1. In Server Manager, click the **yellow warning flag** near the top right and choose **Promote this server to a domain controller**.
2. Select **Add a new forest** and enter the root domain name: `lab.internal`. Click Next.
3. On the Domain Controller Options screen:
   - Leave the forest and domain functional levels at the default (Windows Server 2025).
   - Leave **DNS server** checked. This installs DNS and is exactly what you want.
   - Set a **DSRM password** and write it down. This is a special recovery password, separate from your Administrator password. You will rarely need it, but do not lose it.
4. Click Next. A warning about DNS delegation appears ("A delegation for this DNS server cannot be created..."). This is expected in a lab and safe to ignore. Click Next.
5. The NetBIOS name defaults to **LAB**. Keep it and click Next.
6. Keep the default folder paths and click Next.
7. Review the summary, click Next, and once the prerequisites check passes (warnings are fine, errors are not), click **Install**.
8. The server reboots itself when the promotion finishes.

After the reboot, the login screen shows **LAB\Administrator**. Same account, same password as before. The `LAB\` prefix just means it is now a domain account.

## Verify DNS Is Working

The promotion made DC01 its own DNS server. Confirm everything works before moving on.

Open a Command Prompt and run:

```
nslookup dc01.lab.internal
```

You should get back 10.0.10.10. That proves the domain's DNS zone exists and DC01 registered itself in it.

Now test an internet name:

```
ping google.com
```

If this works too, you are done with this section. If internet names fail but `nslookup dc01.lab.internal` works, add a forwarder:

1. Open **Server Manager > Tools > DNS**.
2. Expand DC01, right-click it, and choose **Properties**.
3. On the **Forwarders** tab, click **Edit**, add `8.8.8.8`, and click OK twice.
4. Test `ping google.com` again.

A forwarder tells your DNS server where to send questions it cannot answer itself. DC01 answers everything about `lab.internal` on its own and passes internet lookups upstream.

:::note
Remember the temporary 8.8.8.8 DNS setting from Module 3? The promotion replaced it. DC01's network adapter now points at itself for DNS, which is required for a domain controller. You do not need to change adapter settings again.
:::

## Take a Snapshot

Shut down DC01 from inside Windows, then in VirtualBox Manager take a snapshot named `Domain controller - lab.internal`.

## Checklist Before Moving On

- [ ] Login screen shows LAB\Administrator
- [ ] `nslookup dc01.lab.internal` returns 10.0.10.10
- [ ] `ping google.com` works
- [ ] Snapshot taken

Continue to Module 5 to set up DHCP so client machines can get addresses automatically.
