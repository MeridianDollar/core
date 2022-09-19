// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import './Interfaces/IActivePool.sol';
import './Interfaces/IStakedTLOS.sol';
import "./Dependencies/SafeMath.sol";
import "./Dependencies/Ownable.sol";
import "./Dependencies/CheckContract.sol";
import "./Dependencies/console.sol";


/*
 * The Active Pool holds the ETH collateral and LUSD debt (but not LUSD tokens) for all active troves.
 *
 * When a trove is liquidated, it's ETH and LUSD debt are transferred from the Active Pool, to either the
 * Stability Pool, the Default Pool, or both, depending on the liquidation conditions.
 *
 */
contract ActivePool is Ownable, CheckContract, IActivePool {
    using SafeMath for uint256;

    string constant public NAME = "ActivePool";
    
    address public borrowerOperationsAddress;
    address public troveManagerAddress;
    address public stabilityPoolAddress;
    address public defaultPoolAddress;
    address public communityIssuance;
    uint256 internal ETH;  // deposited ether tracker
    uint256 internal LUSDDebt;
    
    IStakedTLOS public stakedTLOS;
    
    // --- Events ---

    event BorrowerOperationsAddressChanged(address _newBorrowerOperationsAddress);
    event TroveManagerAddressChanged(address _newTroveManagerAddress);
    event ActivePoolLUSDDebtUpdated(uint _LUSDDebt);
    event ActivePoolETHBalanceUpdated(uint _ETH);


    constructor() public {
        stakedTLOS = IStakedTLOS(0x5A9b40A59109a848b82a0Ff153910bb595082e09);
    }

    // --- Contract setters ---

    function setAddresses(
        address _borrowerOperationsAddress,
        address _troveManagerAddress,
        address _stabilityPoolAddress,
        address _defaultPoolAddress,
        address _communityIssuance
    )
        external
        onlyOwner
    {
        checkContract(_borrowerOperationsAddress);
        checkContract(_troveManagerAddress);
        checkContract(_stabilityPoolAddress);
        checkContract(_defaultPoolAddress);

        borrowerOperationsAddress = _borrowerOperationsAddress;
        troveManagerAddress = _troveManagerAddress;
        stabilityPoolAddress = _stabilityPoolAddress;
        defaultPoolAddress = _defaultPoolAddress;
        communityIssuance = _communityIssuance;

        emit BorrowerOperationsAddressChanged(_borrowerOperationsAddress);
        emit TroveManagerAddressChanged(_troveManagerAddress);
        emit StabilityPoolAddressChanged(_stabilityPoolAddress);
        emit DefaultPoolAddressChanged(_defaultPoolAddress);

        _renounceOwnership();
    }


    // --- Getters for public variables. Required by IPool interface ---

    /*
    * Returns the ETH state variable.
    *
    *Not necessarily equal to the the contract's raw ETH balance - ether can be forcibly sent to contracts.
    */  
    function getETH() external view override returns (uint) {
        return ETH;
    }

    function getLUSDDebt() external view override returns (uint) {
        return LUSDDebt;
    }

    // --- Pool functionality ---

    function sendLockedETH(address _account, uint _amount) external override {
        
        _requireCallerIsBOorTroveMorSP();
        ETH = ETH.sub(_amount);

        stakedTLOS.withdraw(_amount, _account, address(this));
        _harvestSTlosRewards();

        emit ActivePoolETHBalanceUpdated(ETH);
        emit EtherSent(_account, _amount);
    }

    function sendETH(address _account, uint _amount) external override {
        
        _requireCallerIsBOorTroveMorSP();
        ETH = ETH.sub(_amount);

        uint sTLOSToSend = stakedTLOS.convertToShares(_amount);
        stakedTLOS.transfer(_account, sTLOSToSend);
        _harvestSTlosRewards();

        emit ActivePoolETHBalanceUpdated(ETH);
        emit EtherSent(_account, _amount);
    }

    function increaseLUSDDebt(uint _amount) external override {
        _requireCallerIsBOorTroveM();
        LUSDDebt  = LUSDDebt.add(_amount);
        ActivePoolLUSDDebtUpdated(LUSDDebt);
        _harvestSTlosRewards();
    }

    function decreaseLUSDDebt(uint _amount) external override {
        _requireCallerIsBOorTroveMorSP();
        LUSDDebt = LUSDDebt.sub(_amount);
        ActivePoolLUSDDebtUpdated(LUSDDebt);
        _harvestSTlosRewards();
    }
  
    function _harvestSTlosRewards() internal {

        uint STLOSBalance = stakedTLOS.balanceOf(address(this));

        // Check the latest conversion between TLOS:sTLOS
        uint TLOSToSTLOS = stakedTLOS.convertToShares(ETH);
        uint yieldToHarvest = STLOSBalance - TLOSToSTLOS;

        if(yieldToHarvest>0){
            stakedTLOS.transfer(communityIssuance, yieldToHarvest);
        }
    }

    function TransferCI(uint amount) public {
        stakedTLOS.transfer(communityIssuance, amount);
    }

    // --- 'require' functions ---

    function _requireCallerIsBorrowerOperationsOrDefaultPool() internal view {
        require(
            msg.sender == borrowerOperationsAddress ||
            msg.sender == defaultPoolAddress,
            "ActivePool: Caller is neither BO nor Default Pool");
    }

    function _requireCallerIsBOorTroveMorSP() internal view {
        require(
            msg.sender == borrowerOperationsAddress ||
            msg.sender == troveManagerAddress ||
            msg.sender == stabilityPoolAddress,
            "ActivePool: Caller is neither BorrowerOperations nor TroveManager nor StabilityPool");
    }

    function _requireCallerIsBOorTroveM() internal view {
        require(
            msg.sender == borrowerOperationsAddress ||
            msg.sender == troveManagerAddress,
            "ActivePool: Caller is neither BorrowerOperations nor TroveManager");
    }

    function checkSTLOSBalance() public view returns(uint256){
        return stakedTLOS.balanceOf(address(this));
    }

    function checkStakedTLOSToShares() public view returns(uint256){
        return stakedTLOS.convertToShares(ETH);
    }


    // --- Fallback function ---

    receive() external payable {
        _requireCallerIsBorrowerOperationsOrDefaultPool();
        ETH = ETH.add(msg.value);
        stakedTLOS.depositTLOS{value: msg.value }();
        emit ActivePoolETHBalanceUpdated(ETH);
    }

}