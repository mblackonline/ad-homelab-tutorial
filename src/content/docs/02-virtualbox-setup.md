---
title: "Module 2: VirtualBox Setup"
description: Install VirtualBox and create the isolated lab network.
---

:::note
Content coming soon. This page will cover everything below.
:::

## In This Module

- Install VirtualBox
- Create a NAT Network for the lab (10.0.10.0/24)
- Disable VirtualBox's built-in DHCP so your Domain Controller can provide it instead
- Understand why the lab uses its own isolated network

## How the Lab Network Works

The lab runs on its own private network inside your computer. The VMs can talk to each other and reach the internet for updates and downloads, but the lab's DHCP, DNS, and Active Directory traffic never touches your home network, and your home devices cannot connect into the lab.

That isolation is one-way, though. Lab VMs can still make outbound connections to the internet and to your home network, so the lab is contained, not sealed. It is safe for everything this guide teaches, but it is not a sandbox for malware samples or penetration testing tools like Kali Linux. That kind of work requires a fully isolated network with no internet access and is beyond the scope of this guide.

![Diagram showing the lab's NAT Network inside the VirtualBox host: lab VMs share a private 10.0.10.0/24 network, outbound internet access is allowed through NAT, and inbound connections from home devices are blocked.](../../assets/nat-network-diagram.png)
