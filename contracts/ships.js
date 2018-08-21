let s; // ships contract

const reasons = require('../resources/reasons.json');

let account; // assumed caller address

function setContract(ships)
{
  s = ships;
}

function setAccount(a)
{
  account = a;
}

//
// data getters, return promises
//

function getShip(ship)
{
  return s.methods.ships(ship).call();
}

function getSpawned(ship)
{
  return s.methods.getSpawned(ship).call();
}

function getOwnedShips(address)
{
  address = address || account;
  return s.methods.getOwnedShipsByAddress(address).call();
}

function getManagingFor(address)
{
  address = address || account;
  return s.methods.getManagingFor(address).call();
}

function getTransferringFor(address)
{
  address = address || account;
  return s.methods.getTransferringFor(address).call();
}

function getSpawningFor(address)
{
  address = address || account;
  return s.methods.getSpawningFor(address).call();
}

function getVotingFor(address)
{
  address = address || account;
  return s.methods.getVotingFor(address).call();
}

//
// chain-data checks, return bool promises
//
//NOTE most of these also accept objects, to save on network calls if the data
//     is already known. calling with an object returns bool, not promise
//

function isActive(ship)
{
  if (typeof ship === 'object') return (ship.active);
  return s.methods.isActive(ship).call();
}

function hasBeenBooted(ship)
{
  if (typeof ship === 'object') return (ship.keyRevisionNumber > 0);
  return s.methods.hasBeenBooted(ship).call();
}

function isOwner(ship, owner)
{
  owner = owner || account;
  if (typeof ship === 'object') return (ship.owner === owner);
  return s.methods.isOwner(ship, owner).call();
}

function isOperator(owner, operator)
{
  operator = operator || account;
  return s.methods.isOperator(owner, operator).call();
}

function isTransferProxy(ship, proxy)
{
  proxy = proxy || account;
  if (typeof ship === 'object')
    return (ship.transferProxy === proxy);
  return s.methods.isTransferProxy(ship, proxy).call();
}

function isSpawnProxy(ship, address)
{
  address = address || account;
  if (typeof ship === 'object') return (ship.spawnProxy === address);
  return s.methods.isSpawnProxy(ship, address).call();
}

function canManage(ship, address)
{
  address = address || account;
  return s.methods.canManage(ship, address).call();
}

function canVoteAs(ship, address)
{
  address = address || account;
  return s.methods.canVoteAs(ship, address).call();
}

//
// business logic checks, return result object
//

async function checkActiveShipManager(ship, owner)
{
  owner = owner || account;
  res = { result: false };
  if (!await canManage(ship))
  {
    res.reason = reasons.permission;
    return res;
  }
  if (!await isActive(ship))
  {
    res.reason = reasons.inactive;
    return res;
  }
  res.result = true;
  return res;
}

async function checkActiveShipVoter(galaxy, voter)
{
  voter = voter || account;
  let res = { result: false };
  // must either be ship owner, or delegate for the owner
  if (!await canVoteAs(galaxy, voter))
  {
    res.reason = reasons.permission;
    return res;
  }
  // ship must be active in order to vote
  if (!await isActive(galaxy))
  {
    res.reason = reasons.inactive;
    return res;
  }
  res.result = true;
  return res;
}

module.exports = {
  setContract,
  setAccount,
  //
  getShip,
  getSpawned,
  getOwnedShips,
  getManagingFor,
  getTransferringFor,
  getSpawningFor,
  getVotingFor,
  //
  isActive,
  hasBeenBooted,
  isOwner,
  isOperator,
  isTransferProxy,
  isSpawnProxy,
  canManage,
  canVoteAs,
  //
  checkActiveShipManager,
  checkActiveShipVoter
}
