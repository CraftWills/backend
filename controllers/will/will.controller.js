const bcrypt = require("bcrypt");
// const momen = require("moment-timezone");

require("dotenv").config();
// const ExpressError = require("../Errorgenerator/errorGenerator");
const { generateAccessToken } = require("../../JsonWebToken/jwt");
const WillDataAccess= require("../../dal/Will/will.dal");
const Will = require ("../../models/Will/will.model");
const usersDataAccess= require("../../dal/user.dal");
const User = require("../../models/user.model");
const {myFunction} = require ("../../nodemailer/nodemailer");
const date = require ("date-and-time");
var todayDate=(date.format(new Date(), 'MM-DD-YYYY'));
const member = require("../../models/members.model");
var count = 0
var ObjectId = require('mongodb').ObjectID;
exports.storeWill = async (req,res) => {
  const _id = req.token_data._id
  const now = new Date()
  try {
    const data = new Will({
      user_id : _id,
      // Personal Information
      DATE : date.format(now, 'MM-DD-YYYY | HH:mm:ss'),
      id_number : req.body.id_number,
      id_type :  req.body.id_Type,
      fullName : req.body.fullName,
      gender : req.body.gender,
      willName : "My Will Version "+ count++,
      email : req.body.email,
      floorNumber : req.body.floorNumber,
      unitNumber : req.body.unitNumber,
      streetName : req.body.streetName,
      postalCode : req.body.postalCode,
      assetScope : req.body.assetScope,
      // Appoint Primary Executor
      primary_executor_type : req.body.primary_executor_type,
      primaryExecutors : req.body.primaryExecutors,
      // Appoint Replacement Executor
      replacement_executor_type : req.body.replacement_executor_type,
      replacementExecutors : req.body.replacementExecutors,
      // Appoint Guardian
      guardian_type : req.body.guardian_type,
      guardian_executor_type : req.body.guardian_executor_type,
      guardianExecutor : req.body.guardianExecutor,
      // Appoint Replacement Guardian
      guardian_replacement_executor_type : req.body.guardian_replacement_executor_type,
      guardianReplacementExecutor : req.body.guardianReplacementExecutor,
      // Distribution of Assets
      // Liabilities
      liabilitiesData : req.body.liabilitiesData,
      // Assets
      assets : req.body.assets,
      assetsResidualType : req.body.assetsResidualType,
      // Trust

      trust : req.body.trust,
      // Distribute Residual Assets
      specifyResidualAssetBenificiary : req.body.specifyResidualAssetBenificiary,
      trustFallback : req.body.trustFallback,
      residualAssetsId : req.body.residualAssetsId,
      manualAssets : req.body.manualAssets,
      residualFallbackRadio : req.body.residualFallbackRadio,
      replacementResidualMemberId : req.body.replacementResidualMemberId,
      // Clauses 
      clauses : req.body.clauses,
    })

const savedData = await data.save();
  // if (savedData){
  //   const memberData = await member.updateMany({
  //     user_id: _id
  //   },{$set : {
  //     isMember : false
  //   }}, { new: true })
  // console.log(memberData)
  // }

if (savedData){

    const memberIds = []
     
    const data = await member.find({user_id:_id})
    data.forEach(async(el)=>{
      memberIds.push(el._id)
      const Willdata = await Will.find({"member":el._id});
      console.log(Willdata)
    })

    console.log(memberIds)
    // const Willdata = await Will.find({"member":memberIds})
    // console.log(Willdata)
    // console.log("willdata via Member:   ",Willdata)
    // data.forEach((el)=>{
    //   memberIds.push(el._id)
    // })
    // console.log(memberIds)
  }
    // console.log(savedData);
   res.json({
      message : "Data has been saved successfully",
      success : true,
      data : savedData
    })
    
  } catch (err){
    res.json({
      message : "Error Found",
      success : false,
      error : err.message
    })
  }
}


// Getting Business Details


exports.getWillDetails = async (req, res) => {
  try{
    const user = req.token_data._id
    const users = await Will.find({user_id : user});   
  return {
      error: false,
      success: true,
      message: "Will Found Successfully",
      data: users
    };
  }
  catch(err){
    return err.message
  }
}


exports.pastVersions = async (req,res)=>{
  const user = req.token_data._id
  try {
  const users = await WillDataAccess.findPastVersions(user)  
  console.log(users)

  res.json({
    message : "data found successfully",
    success : true,
    data : users
  })
} catch (err){
  res.json({
    message : "something went wrong",
    success : false,
    error : err.message
  })
}
}

// get a single will by its id;

exports.getWill = async(req,res)=>{
  try {
  const data = await Will.findById(req.params.id)
  res.json({
    message : "data found successfully",
    success : true,
    data : data
  })
  }catch(err){
    req.json({
      message : "something went wrong",
      success : false,
      error : err.message
    })
  }
}

// Update Bank Details


exports.UpdateWillData = async (req, res) => {
  const _id = req.params.id
  const updateData = {
    _id,
    toUpdate: {
      id_number : req.body.id_number,
      id_type :  req.body.id_Type,
      fullName : req.body.fullName,
      willName : "My Will Version "+ count++,
      gender : req.body.gender,
      email : req.body.email,
      floorNumber : req.body.floorNumber,
      unitNumber : req.body.unitNumber,
      streetName : req.body.streetName,
      postalCode : req.body.postalCode,
      assetScope : req.body.assetScope,
      // Appoint Primary Executor
      primary_executor_type : req.body.primary_executor_type,
      primaryExecutors : req.body.primaryExecutors,
      // Appoint Replacement Executor
      replacement_executor_type : req.body.replacement_executor_type,
      replacementExecutors : req.body.replacementExecutors,
      // Appoint Guardian
      guardian_type : req.body.guardian_type,
      guardian_executor_type : req.body.guardian_executor_type,
      guardianExecutor : req.body.guardianExecutor,
      // Appoint Replacement Guardian
      guardian_replacement_executor_type : req.body.guardian_replacement_executor_type,
      guardianReplacementExecutor : req.body.guardianReplacementExecutor,
      // Distribution of Assets
      // Liabilities
      liabilitiesData : req.body.liabilitiesData,
      // Assets
      assets : req.body.assets,
      assetsResidualType : req.body.assetsResidualType,
      // Trust
      trust : req.body.trust,
      // Distribute Residual Assets
      specifyResidualAssetBenificiary : req.body.specifyResidualAssetBenificiary,
      trustFallback : req.body.trustFallback,
      residualAssetsId : req.body.residualAssetsId,
      manualAssets : req.body.manualAssets,
      residualFallbackRadio : req.body.residualFallbackRadio,
      replacementResidualMemberId : req.body.replacementResidualMemberId,
      // Clauses 
      clauses : req.body.clauses
    },
  };
const update = await WillDataAccess.updateWill(updateData);
if (update){
  return {
    error: false,
    message: "Will data updated successfully",
    success: true,
    data: update,
  };
}
else {
return "something went wrong"
}
};




exports.deleteWills = async(req,res)=>{
  try{
    await Will.remove();
    res.send("data has been removed successfully");
  }
  catch(err){
    res.json({
      success : false,
      error : true,
      message : err.message
    })
  }
}

exports.deleteWillById = async(req,res)=>{
  try{
    const _id = req.params.id
    const id = req.token_data._id
    const deleteWill = await Will.findByIdAndRemove({_id});
    if (deleteWill){
      const dta = await member.find({user_id : id});
      dta.forEach((item,index)=>{
          item.isMember = true
      })
      console.log(dta)
       res.json({
         success : true,
         error : false,
         message : "Will data has been deleted successfully"
     })
  }
  else{
    res.json({
      success : false,
      error : true,
      message : "Will data not found"
    })
  }
}
  catch(err){
    res.json({
      success : false,
      error : true,
      message : err.message,
      })
  }
}


exports.generatePdf = async(req,res)=>{
  try{
    const user = "62024fe88ae810371198893f"
    const users = await Will.find({user_id : user});   
    console.log(users[0].fullName)
    console.log(users[0].id_number)
    let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>MyApp</title>
        <base href="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <!-- <script src="https://cdn.tailwindcss.com"></script> -->
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
          integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="pdf.css">
        <style>
            *{
                font-family: 'GilroyMedium';
                font-weight: 400;
            }
          table,
          th,
          td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 12px 20px;
            margin: 10px;
        }
          
          th{
              background-color: #c1c1c1;
          }
          .title-text{
    font-family: 'GilroySemi';
    font-size: large;
          }
          @font-face {
            font-family: 'GilroyMedium';
            font-style: normal;
            font-weight: 500;
            src: local('Gilroy'), url('../src/assets/fonts/Gilroy/gilroy-medium.ttf') format('truetype');
          }
          
          @font-face {
            font-family: 'GilroySemi';
            font-style: normal;
            font-weight: bold;
            src: local('Gilroy'), url('../src/assets/fonts/Gilroy/gilroy-semi-bold.ttf') format('truetype');
          }
          
          @font-face {
            font-family: 'GilroyBold';
            font-style: normal;
            font-weight: bolder;
            src: local('Gilroy'), url('../src/assets/fonts/Gilroy/gilroy-bold.ttf') format('truetype');
          }
          @font-face {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: normal;
            src: local('Gilroy'), url('../src/assets/fonts/Gilroy/gilroy-regular.ttf') format('truetype');
          }
    .witness-container{
        margin-top: 10px;
        display: flex;
        width: 100%;
        flex-wrap: wrap;
    
    }
    .witness-container div{
        width: 50%;
        margin-top: 5px;
        display: flex;
        flex-direction: column;
    }
    .list-wrapper{
        display: flex;
        margin: 5px 20px;
        flex-direction: column;
    }
    .list-wrapper span{
        margin: 3px;
    }
        </style>
      </head>
    
      <body class="mat-typography">
        <table>
          <tr>
            <th class="GilroyBold">TYPE OF CLAUSE</th>
            <th>CLAUSE</th>
            <th>COSTS</th>
          </tr>
          <tr>
            <td class="title-text">INTRODUCTION</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              Overseas and local assets Will <span class="title-text">[4.1 – International]</span> *covers all
              assets wherever they may be situated, including overseas properties &
              overseas bank accounts.
            </td>
            <td>
              I, <span class="title-text">${users[0].fullName} ${users[0].id_number},of ${users[0].streetName}
              ${users[0].postalCode}</span>, HEREBY REVOKE all former wills, codicils and
              testamentary dispositions hereinbefore made by me AND DECLARE this to
              be my Last Will and Testament (hereinafter called my “Will”). This
              Will covers all my movable and immovable property whatsoever and
              wheresoever situate which I may be possessed of or entitled to at my
              death (including any property over which I may have a power of
              appointment or disposition by will).
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              Local assets Will only [4.1 - Singapore] *only assets located in
              Singapore, may be concurrent with other wills which dispose of
              overseas assets.
            </td>
            <td>
              I <span class="title-text">${users[0].fullName} ${users[0].id_number}, of ${users[0].streetName}
              ${users[0].postalCode}</span>, HEREBY REVOKE all former wills and testamentary
              dispositions made by me in relation to all my immovable and movable
              property in Singapore only and I DECLARE this to be my last Will
              relating thereto (hereinafter called my “Will”). I expressly DECLARE
              that I do not revoke any wills or testamentary dispositions made by me
              other than in relation to my immovable and movable property in
              Singapore, and further DECLARE that this Will shall be read, construed
              and proved independently of any will or wills which I have made or may
              make in respect of my assets outside of Singapore and shall not affect
              any other will or wills which I have made or may make in respect of my
              assets outside of Singapore.
            </td>
            <td></td>
          </tr>
          <tr>
            <td class="title-text">EXECUTORS</td>
            <td>
              *An executor must not be a bankrupt and must be above 21 years old and
              can also be a beneficiary . *An executor must apply to the Court for a
              Probate after the death of the testator, arrange for payments of
              debts, and distribute assets to the beneficiary/ies according to your
              will . *If the distribution of a gift to a beneficiary is to be
              delayed e.g. a child below 21 years old or a child with special needs
              who shall not get the gift(s) right away, then such delayed gift is to
              be entrusted to a trustee for distribution e.g. paid only when the
              child reaches 21 years old or above. An executor can also be appointed
              to be a trustee.
            </td>
            <td></td>
          </tr>
          <tr>
            <td>Appointment of sole executor</td>
            <td>
              I APPOINT  <span class="title-text">[EXECUTOR NAME] [NRIC NO.], of [address] </span>to be the sole
              executor of this my Will (hereinafter called “my Executor”). OR I
              APPOINT  <span class="title-text">[LAW FIRM NAME] [UEN NO.], of [address]</span> to be the sole
              executor of this my Will (hereinafter called “my Executor”).
            </td>
            <td>
              First Executor FREE Add $75 instead of $50 if a law firm is appointed
              as executor *For appointment of a law firm as executor, please refer
              to the law firm’s schedule of future costs in acting as executor
            </td>
          </tr>
          <tr>
            <td>Appointment of joint executors</td>
            <td>
              I APPOINT  <div class="list-wrapper">
                <span class="title-text"> [EXECUTOR NAME 1] [NRIC NO.], of [address]</span>
                <span class="title-text"> [EXECUTOR NAME 1] [NRIC NO.], of [address]</span>
                <span class="title-text"> [EXECUTOR NAME 1] [NRIC NO.], of [address]</span>
                <span class="title-text"> [EXECUTOR NAME 1] [NRIC NO.], of [address]</span>
    
            </div>   to be the
              joint executors of this my Will (hereinafter called “my Executors”).
            </td>
            <td>
              $50 per additional Executor Add $75 instead of $50 if a law firm is
              appointed as executor
            </td>
          </tr>
          <tr>
            <td>
              Joint executors to act jointly or jointly and severally *Jointly means
              all must work together and sign all documents together *Jointly and
              severally means any one of the executors can act or sign the documents
              without the other signing, or alternatively, all can act or sign
              together
            </td>
            <td>My Executors shall act  <span class="title-text">[jointly]/[jointly and severally]</span>.</td>
            <td></td>
          </tr>
          <tr>
            <td>Appointment of replacement executor/s</td>
            <td>
              If the above-named executor or executors shall predecease me or shall
              be unable to act, then and only then I APPOINT 
              <div class="list-wrapper">
                <span class="title-text"> [NAME OF REPLACEMENT EXECUTOR 1] [NRIC NO.], of [address], </span>
                <span class="title-text"> [NAME OF REPLACEMENT EXECUTOR 1] [NRIC NO.], of [address], </span>
                <span class="title-text"> [NAME OF REPLACEMENT EXECUTOR 1] [NRIC NO.], of [address], </span>
                <span class="title-text"> [NAME OF REPLACEMENT EXECUTOR 1] [NRIC NO.], of [address], </span>
    
            </div> 
             as the replacement executor/s of this my Will who shall act
             <span class="title-text">[solely]/[jointly]/[jointly and severally]</span>. I <span class="title-text">declare</span> that in this
              Will, the expression “my executor/s” shall, where the context admits,
              include the replacement executor/s of this Will.
            </td>
            <td>Add $50 per replacement executor</td>
          </tr>
          <tr>
            <td>
              Appointment of replacement executor – when law firm unable to act
            </td>
            <td>
              If the above-named executor shall be unable to act for any reason, I
              EMPOWER my executor/s to appoint a suitable replacement executor,
              including a professional trustee such as a licensed trust company. I
              <span class="title-text">declare</span> that in this Will, the expression “my executor/s” shall, where
              the context admits, include the replacement executor/s of this Will.
            </td>
            <td></td>
          </tr>
          <tr>
            <td class="title-text">PROVISION FOR DEBTS AND EXPENSES (DEFAULT)</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td >Provision for debts and expenses</td>
            <td>I <span class="title-text">DIRECT</span>  that all my just debts, funeral and testamentary expenses, estate duty payable in respect of my estate, and any other expenses that may be reasonably incurred upon or by reason of my death, be paid out of my estate. 
            </td>
            <td>FREE</td>
          </tr>
          <tr>
            <td class="title-text">GUARDIANS (If opt 1 selected then no show this form section)</td>
            <td>
              *Guardian must be above 21 years old and must not be the other parent
              of the child.
            </td>
            <td>$50 if opt 2/3 (Free if no guardianship clause  <span class="title-text">[opt1]</span>)</td>
          </tr>
          <tr>
            <td>Appointment of joint guardians (opt3)</td>
            <td>
              If the other parent of my child/ren has predeceased me or shall not
              survive me, I APPOINT 
              <div class="list-wrapper">
                <span class="title-text">[GUARDIAN NAME 1] [NRIC NO.], of [address]  </span>
                <span class="title-text">[GUARDIAN NAME 1] [NRIC NO.], of [address]  </span>
                <span class="title-text">[GUARDIAN NAME 1] [NRIC NO.], of [address]  </span>
                <span class="title-text">[GUARDIAN NAME 1] [NRIC NO.], of [address]  </span>
    
            </div> to be the guardian/s of my
              child/ren during their minority to act jointly.
            </td>
            <td>$25 per additional guardian</td>
          </tr>
          <tr>
            <td>
              Appointment of guardian to act jointly with other parent (opt 2)
            </td>
            <td>
              If the above-named guardian/s shall predecease me or shall be unable
              to act, then and only then I APPOINT  <span class="title-text">[GUARDIAN NAME 1] [NRIC NO.], of
              [address] and [GUARDIAN NAME 2] [NRIC NO.], of [address] </span>to be the
              replacement guardian/s of my child/ren during their minority to act
              <span class="title-text">[solely./jointly./ jointly with the other parent of my child/ren if
              the other parent shall survive me.]</span>
            </td>
            <td>$50 per replacement guardian</td>
          </tr>
          <tr>
            <td class="title-text">TOTAL ASSET POOL</td>
            <td>IF (no specific gifts) then show in residual assets.</td>
            <td>$50 per replacement guardian</td>
          </tr>
          <tr>
            <td class="title-text">SPECIFIC GIFTS</td>
            <td>
              (IF specific gifts = yes) *Specific gifts are specifically identified
              gifts to be distributed to specific beneficiaries. Specific gifts may
              be distributed forthwith or distributed into a trust managed by
              trustee/s according to your directions. Residuary estate distribution
              will be performed after the specific gifts are distributed.
            </td>
            <td>$50 per specific gift</td>
          </tr>
          <tr>
            <td>Specific assets to be distributed
    
                Bank account / 
                Company shares / 
                Real estate </td>
            <td>
                I <span class="title-text"> GIVE, DEVISE AND BEQUEATH </span>all my shares, rights and interests in [asset name, asset identifier, location], held  <span class="title-text">[“solely in my name” / “jointly with owner_name1, owner_name2”]
     </span>
    
                (IF 1 BENEFICIARY)
                to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF BENEFICIARY 1] [NRIC No.] solely.
                
                (IF >1 BENEFICIARY)
                to the following beneficiaries in the following proportions:
                <ul class="title-text">
    
                    <li> <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF  BENEFICIARY 1] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF  BENEFICIARY 2] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF  BENEFICIARY 3] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF  BENEFICIARY 4] [NRIC No.]</li>
                    <li> <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF  BENEFICIARY 5] [NRIC No.]</li>
                </ul>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>If checkbox opt 1 – if there is only one original beneficiary 
    
                Share to form part of residuary estate </td>
            <td>
                If the aforesaid beneficiary shall die in my lifetime, then the above gift shall be added to my residuary estate to be distributed according to my directions hereinbelow. 
                
                
            </td>
            <td></td>
          </tr>
          <tr>
            <td>If checkbox opt 2 – if there is only one original beneficiary  
    
                Replacement beneficiary/ies to take share</td>
            <td>
                If the aforesaid beneficiary shall die in my lifetime, then the above gift shall be distributed to the following replacement beneficiary/ies in the following proportions: -
                <ul>
    
                    <li> <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 1] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 2] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 3] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 4] [NRIC No.]</li>
                    <li> <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 5] [NRIC No.]</li>
                </ul>
                </td>
            <td></td>
          </tr>
          <tr>
            <td>If checkbox opt 3 – if there are multiple original beneficiaries
    
                Children to take share</td>
            <td>
                If any of the aforesaid beneficiaries shall die in my lifetime but leave behind a child/children, then such child of the predeceased beneficiary shall take by substitution absolutely, and if more than one child, then such children of the predeceased beneficiary shall take by substitution equally, the share of my estate which such predeceased beneficiary would be entitled to take if he or she had survived me.
            </td>
            <td></td>
          </tr>
          <tr>
            <td>If checkbox opt 4 – if there are multiple original beneficiaries
    
                Surviving beneficiaries to take share</td>
            <td>
                If any of the aforesaid beneficiaries shall die in my lifetime, then the share of my estate which such predeceased beneficiary would be entitled to take if he or she had survived me shall be distributed to my surviving beneficiary/ies proportionately. 
    
            </td>
            <td></td>
          </tr>
          <tr>
            <td class="title-text">SPECIFIC GIFTS TO BE PLACED ON TRUST 
            </td>
            <td></td>
            <td>$500 per trust</td>
          </tr>
          <tr>
            <td  class="title-text"> PROPERTY TRUST CLAUSE
            </td>
            <td>*A property can be held under a Property Trust if you have a distinct share in the property that belongs to you. This could be where the property is registered in your sole name, or if the property is co-owned by you with your spouse/others as tenants-in-common and each owner has a distinct share, e.g. 50% held by you, 25% held by your spouse and 25% held by your father. In such a case, as a tenant-in-common, you would be able to place your 50% share in the property under a Property Trust.
    
                *If the property is co-owned with your spouse or others in a joint tenancy, you do not have a distinct share that you can dispose of. The last surviving co-owner will take over the sole ownership of the property. If you put such jointly held property under a Property Trust, it will only take effect if you were to take over the sole ownership of the property as the last surviving co-owner. 
                
                *A property that is held under a Property Trust will not add to your beneficiary/ies’ property count, and will not negatively affect their applicable ABSD brackets.
                </td>
            <td>$500</td>
          </tr>
          <tr>
            <td>Gift of property to be held on trust
            </td>
            <td>I GIVE my immovable property known as <span class="title-text">[Property address]</span> (hereinafter called the “<span class="title-text">[Property address]</span> Property”) to my Trustees to hold UPON TRUST (the “<span class="title-text">[Property address]</span> Property Trust”) for the following beneficiaries in the following proportions:
    <ul>
        <li>
            <span class="title-text">[percentage]</span> to <span class="title-text">NAME OF BENEFICIARY 1] [NRIC No.] </span>[        
    
        </li>
        <li>
        <span class="title-text">[percentage]</span> to <span class="title-text">[NAME OF BENEFICIARY 2] [NRIC No.]</span>      
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to <span class="title-text">[NAME OF BENEFICIARY 3] [NRIC No.]</span>
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to <span class="title-text">[NAME OF BENEFICIARY 4] [NRIC No.]</span>
    
        </li>
    </ul>
                
                The trust period of the <span class="title-text">[Property address] </span>Property Trust shall be from the date of my death to the earlier of 
                <ol type="i">
                    <li>the date when the Trustees sell or dispose of the [Property address] Property with the unanimous consent of [Names of persons from whom consent is required]</li>; or
                    <li> [30] years from the date of my death upon which the [Property address] Property shall be sold (the “[Property address] Property Trust Period”).</li>
            
                  </ol>
                
                At the expiry of the [Property address] Property Trust Period, the [Property address] Property may be transferred to or may be sold with the sale proceeds distributed to the aforesaid beneficiary/ies in the aforesaid proportions.
                </td>
            <td>$25 per additional beneficiary beyond first 3 beneficiaries</td>
          </tr>
          <tr>
            <td>If checkbox opt1 – Child/ren to substitute beneficiary who predeceases testator
            </td>
            <td>If any of the aforesaid trust beneficiaries shall die before the expiry of the [Property address]  Property Trust Period but leave behind a child/children, then such child of the deceased beneficiary shall take by substitution absolutely, and if more than one child, then such children of the deceased beneficiary shall take by substitution equally. </td>
            <td>$75 for doing any replacement beneficiary clause  (generator-2.html > beneficiaries)</td>
          </tr>
          <tr>
            <td>If checkbox opt 2 – surviving beneficiaries to split proportionately.
            </td>
            <td>If any of the aforesaid trust beneficiaries shall die before the expiry of the [Property address]  Property Trust Period, then my surviving beneficiary/ies shall take proportionately. 
            </td>
            <td>$75 for doing any replacement beneficiary clause  (generator-2.html > beneficiaries)
            </td>
          </tr>
          <tr>
            <td>If checkbox opt 3 – if there is only one trust beneficiary
    
                Replacement beneficiary</td>
            <td>If the aforesaid trust beneficiary shall die before the expiry of the [Property address] Property Trust Period, then the following replacement trust beneficiaries shall take in the following proportions: - 
                <ul>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 1] [NRIC No.]</li>
                    <li> <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 2] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 3] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 4] [NRIC No.] and</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 5] [NRIC No.]</li>
                </ul>
                </td>
            <td>$25 per replacement beneficiary</td>
          </tr>
          <tr>
            <td  class="title-text">
                CASH TRUST CLAUSE
                </td>
            <td>
                *Placing cash for your beneficiary/ies in a Cash Trust allows you to design and implement a system for paying out to the beneficiary/ies over a period of time and avoid situations where the beneficiary/ies dissipates the inheritance too quickly.
                </td>
            <td>
                $500</td>
          </tr>
          <tr>
            <td>Gift of cash to be held on trust for beneficiaries in proportions</td>
            <td>I <span  class="title-text">GIVE</span>  the sum of [$1,000,000.00] together with all income generated therefrom (the “Cash Trust Assets”) to my Trustees <span class="title-text">UPON TRUST</span>  (the “Cash Trust”) on the following terms:
    <ul>
        <li>The trust period of the Cash Trust shall be from the date of my death to 
            
            <ol type="i">
            <li>the date when the Cash Trust Assets are depleted or </li>
            <li> <span class="title-text">[30]</span>years from the date of my death, whichever is the earlier (the “Cash Trust Period”)</li>
    
          </ol></li>
        <li>Subject to the Trustee Powers, my Trustees shall distribute the Cash Trust Assets in the following manner:-</li>
    </ul>
                
                
                
                
                to pay out a total sum of up to [$100,000.00] on a yearly basis to 
                
     
                <div class="list-wrapper">
                   <span class="title-text">  [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                   <span class="title-text">  [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                   <span class="title-text">  [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                   <span class="title-text">  [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                   <span class="title-text">  [NAME OF BENEFICIARY 1] [NRIC No.]</span>
    
               </div> in the following proportions:
                <div class="list-wrapper">
                   <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                   <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                   <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                   <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1] [NRIC No.]</span>
               </div> 
                
                
                The payouts shall be made periodically as my Trustees shall deem fit, until the expiry of the Cash Trust Period, upon which any undistributed cash in the Cash Trust shall be distributed to the aforesaid beneficiary/ies in the aforesaid proportions. to 
                <div class="list-wrapper">
                    <span class="title-text">[NAME OF BENEFICIARY 1]</span>
                    <span class="title-text">[NAME OF BENEFICIARY 1]</span>
                    <span class="title-text">[NAME OF BENEFICIARY 1]</span>
                    <span class="title-text">[NAME OF BENEFICIARY 1]</span>
                </div> 
                in the following proportions:
                <div class="list-wrapper">
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1]</span>
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1]</span>
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1]</span>
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1]</span>
            </div> 
                </td>
            <td></td>
          </tr>
          <tr>
            <td>If checkbox opt1 – Child to substitute beneficiary who dies before expiry of Cash Trust Period</td>
            <td>If any of the aforesaid trust beneficiaries shall die before the expiry of the Cash Trust Period but leave behind a child/children, then such child of the deceased beneficiary shall take by substitution absolutely, and if more than one child, then such children of the deceased beneficiary shall take by substitution equally. 
            </td>
            <td>$75 for doing any replacement beneficiary clause  (generator-2.html > beneficiaries)
            </td>
          </tr>
          <tr>
            <td>If checkbox opt2 – surviving beneficiaries to split proportionately.
            </td>
            <td>If any of the aforesaid trust beneficiaries shall die before the expiry of the Cash Trust Period, then my surviving beneficiary/ies shall take proportionately.
            </td>
            <td>$75 for doing any replacement beneficiary clause  (generator-2.html > beneficiaries)
            </td>
          </tr>
          <tr>
            <td>If checkbox opt 3 – if there is only one trust beneficiary
    
                Replacement beneficiary</td>
            <td>If the aforesaid trust beneficiary shall die before the expiry of the Cash Trust Period, then the following replacement trust beneficiaries shall take in the following proportions: - 
    
                <ul>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 1] [NRIC No.]</li>
                    <li> <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 2] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 3] [NRIC No.]</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 4] [NRIC No.] and</li>
                    <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 5] [NRIC No.]</li>
                </ul>
                </td>
            <td>$25 per replacement beneficiary</td>
          </tr>
          <tr>
            <td class="title-text">
                STANDBY INSURANCE PROCEEDS TRUST CLAUSE
                </td>
            <td>
                *An Insurance Proceeds Trust is similar to a Cash Trust. You can direct that the payout from your life insurance policy be put in a Standby Insurance Proceeds Trust, and the cash therein be distributed to your beneficiary/ies who you fear may be spendthrifts or are otherwise unable to manage the monies responsibly.
                </td>
            <td>
                $500</td>
          </tr>
          <tr>
            <td>Gift of insurance proceeds to be held on trust for beneficiaries in proportions
            </td>
            <td>I <span class="title-text">GIVE</span>  the insurance proceeds to be paid out from my [name of life insurance policy] insurance policy together with all income generated therefrom (the “Insurance Proceeds Trust Assets”) to my Trustees <span class="title-text">UPON TRUST</span>  (the “Insurance Proceeds Trust”) on the following terms:
    <ul>
        <li>   The trust period of the Insurance Proceeds Trust shall be from the date of my death to 
            <ol type="i">
                <li>the date when the Insurance Proceeds Trust Assets are depleted or </li>
                <li> <span class="title-text">[30]</span> years from the date of my death, whichever is the earlier (the “Insurance Proceeds Trust Period”).</li>
        
              </ol></li>
        <li>   
            Subject to the Trustee Powers, my Trustees shall distribute the Insurance Proceeds Trust Assets in the following manner:-</li>
    </ul>
                 
                to pay out a total sum of up to [$50,000.00] on a yearly basis to 
                <div class="list-wrapper">
                    <span class="title-text">[NAME OF BENEFICIARY 1] [NRIC No.]</span>
                    <span class="title-text"> [NAME OF BENEFICIARY 2] [NRIC No.]</span>
                    <span class="title-text">[NAME OF BENEFICIARY 3] [NRIC No.]</span>
                    <span class="title-text">[NAME OF BENEFICIARY 4] [NRIC No.]</span>
    
                </div>
           and  in the following proportions:
           <div class="list-wrapper">
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 2] [NRIC No.]</span>
                
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 3] [NRIC No.]</span>
                
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 4] [NRIC No.]</span>
                </div>
                The payouts shall be made periodically as my Trustees shall deem fit, until the expiry of the Insurance Proceeds Trust Period, upon which any undistributed cash in the Insurance Proceeds Trust shall be distributed  to the aforesaid beneficiary/ies in the aforesaid proportions. to 
                <div class="list-wrapper">
                <span class="title-text"> [NAME OF BENEFICIARY 1]</span>
                
                <span class="title-text"> [NAME OF BENEFICIARY 2]</span>
                
                <span class="title-text"> [NAME OF BENEFICIARY 3]</span>
                
                <span class="title-text"> [NAME OF BENEFICIARY 4]</span>
                </div>, in the following proportions:
                <div class="list-wrapper">
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1]</span>
                
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 2]</span>
                
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 3]</span>
                
                <span class="title-text">[percentage] to [NAME OF BENEFICIARY 4]</span>
                </div>
                </td>
            <td>$25 per additional beneficiary beyond first 3 beneficiaries</td>
          </tr>
          <tr>
            <td>If checkbox opt1 – Child to substitute beneficiary who dies before expiry of Insurance Proceeds Trust Period</td>
            <td>If any of the aforesaid trust beneficiaries shall die before the expiry of the Insurance Proceeds Trust Period but leave behind a child/children, then such child of the deceased beneficiary shall take by substitution absolutely, and if more than one child, then such children of the deceased beneficiary shall take by substitution equally. 
            </td>
            <td></td>
          </tr>
          <tr>
            <td>If checkbox opt2 – surviving beneficiaries to split proportionately.
            </td>
            <td>If any of the aforesaid trust beneficiaries shall die before the expiry of the Cash Trust Period, then my surviving beneficiary/ies shall take proportionately.
            </td>
            <td></td>
          </tr>
          <tr>
            <td>If checkbox opt 3 – if there is only one trust beneficiary
    
                Replacement beneficiary</td>
            <td>If the aforesaid trust beneficiary shall die before the expiry of the Cash Trust Period, then the following replacement trust beneficiaries shall take in the following proportions: - 
    <ul>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 1] [NRIC No.];
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 2] [NRIC No.];
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 3] [NRIC No.]; 
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 4] [NRIC No.]; and
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 5] [NRIC No.]. 
    
        </li>
    </ul>
    
                </td>
            <td>$25 per replacement beneficiary</td>
          </tr>
          <tr>
            <td>
                STANDBY INSURANCE PROCEEDS TRUST CLAUSE
                </td>
            <td>
                *An Insurance Proceeds Trust is similar to a Cash Trust. You can direct that the payout from your life insurance policy be put in a Standby Insurance Proceeds Trust, and the cash therein be distributed to your beneficiary/ies who you fear may be spendthrifts or are otherwise unable to manage the monies responsibly.
                </td>
            <td>
                $500</td>
          </tr>
          <tr>
              <td>Gift of insurance proceeds to be held on trust for beneficiaries in proportions
            </td>
              <td>I <span class="title-text">GIVE</span> the insurance proceeds to be paid out from my [name of life insurance policy] insurance policy together with all income generated therefrom (the “Insurance Proceeds Trust Assets”) to my Trustees UPON TRUST (the “Insurance Proceeds Trust”) on the following terms:
    <ul>
        <li> The trust period of the Insurance Proceeds Trust shall be from the date of my death to 
            <ol type="i">
                <li>the date when the Insurance Proceeds Trust Assets are depleted or  </li>
                <li><span class="title-text">[30]</span> years from the date of my death, whichever is the earlier (the “Insurance Proceeds Trust Period”).</li>
        
              </ol> </li>
        <li>  Subject to the Trustee Powers, my Trustees shall distribute the Insurance Proceeds Trust Assets in the following manner:-</li>
    </ul>
               
                
              
                
                to pay out a total sum of up to [$50,000.00] on a yearly basis to [NAME OF BENEFICIARY 1] [NRIC No.], [NAME OF BENEFICIARY 2] [NRIC No.], [NAME OF BENEFICIARY 3] [NRIC No.], and [NAME OF BENEFICIARY 4] [NRIC No.] in the following proportions:
                <div class="list-wrapper">
                    <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                    
                    <span class="title-text">[percentage] to [NAME OF BENEFICIARY 2] [NRIC No.]</span>
                    
                    <span class="title-text">[percentage] to [NAME OF BENEFICIARY 3] [NRIC No.]</span>
                    
                    <span class="title-text">[percentage] to [NAME OF BENEFICIARY 4] [NRIC No.]</span>
                    </div>
                
                The payouts shall be made periodically as my Trustees shall deem fit, until the expiry of the Insurance Proceeds Trust Period, upon which any undistributed cash in the Insurance Proceeds Trust shall be distributed  to the aforesaid beneficiary/ies in the aforesaid proportions. to 
                <div class="list-wrapper">
                    <span class="title-text">[NAME OF BENEFICIARY 1]</span>
                    
                    <span class="title-text">[NAME OF BENEFICIARY 2]</span>
                    
                    <span class="title-text">[NAME OF BENEFICIARY 3]</span>
                    
                    <span class="title-text">[NAME OF BENEFICIARY 4]</span>
                    </div>, in the following proportions:
                <div class="list-wrapper">
                    <span class="title-text">[percentage] to [NAME OF BENEFICIARY 1] [NRIC No.]</span>
                    
                    <span class="title-text">[percentage] to [NAME OF BENEFICIARY 2] [NRIC No.]</span>
                    
                    <span class="title-text">[percentage] to [NAME OF BENEFICIARY 3] [NRIC No.]</span>
                    
                    <span class="title-text">[percentage] to [NAME OF BENEFICIARY 4] [NRIC No.]</span>
                    </div>
                </td>
              <td>$25 per additional beneficiary beyond first 3 beneficiaries</td>
          </tr>
          <tr>
              <td>If checkbox opt1 – Child to substitute beneficiary who dies before expiry of Insurance Proceeds Trust Period</td>
              <td>If any of the aforesaid trust beneficiaries shall die before the expiry of the Insurance Proceeds Trust Period but leave behind a child/children, then such child of the deceased beneficiary shall take by substitution absolutely, and if more than one child, then such children of the deceased beneficiary shall take by substitution equally. 
            </td>
              <td>$75 for doing any replacement beneficiary clause  (generator-2.html > beneficiaries)
            </td>
          </tr>
          <tr>
              <td>If checkbox opt2 – surviving beneficiaries to split proportionately.
            </td>
              <td>If any of the aforesaid trust beneficiaries shall die before the expiry of the Insurance Proceeds Trust Period, then my surviving beneficiary/ies shall take proportionately.
            </td>
              <td>$75 for doing any replacement beneficiary clause  (generator-2.html > beneficiaries)
            </td>
          </tr>
          <tr>
              <td>If checkbox opt 3 – if there is only one trust beneficiary
    
                Replacement beneficiary</td>
              <td>If the aforesaid trust beneficiary shall die before the expiry of the Insurance Proceeds Trust Period, then the following replacement trust beneficiaries shall take in the following proportions: - 
    <ul>
        <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 1] [NRIC No.]</li>
        <li> <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 2] [NRIC No.]</li>
        <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 3] [NRIC No.]</li>
        <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 4] [NRIC No.] and</li>
        <li><span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]</span> [NAME OF REPLACEMENT BENEFICIARY 5] [NRIC No.]</li>
    </ul>
                </td>
              <td>$25 per replacement beneficiary</td>
          </tr>
          <tr>
              <td>Supersede earlier inconsistent insurance policy nomination(s)
            </td>
              <td>The terms of this Insurance Proceeds Trust supersede any earlier inconsistent nominations made under the <span class="title-text">[name of life insurance policy].</span>
            </td>
              <td></td>
          </tr>
          <tr>
              <td class="title-text">
                TRUSTEES
                </td>
              <td>
                *A trustee is a party who will hold property/assets on trust and apply/manage them for the benefit of your beneficiary/ies. A trustee must not be a bankrupt and must be above 21 years old. A trustee can also be a beneficiary under the Will. 
                </td>
              <td></td>
          </tr>
          <tr>
              <td>Appointment of sole trustee
            </td>
              <td>I <span class="title-text">APPOINT</span>  [TRUSTEE NAME] [NRIC NO.], of [address] to be the sole trustee of this my Will (“my Trustee”).
    
                OR
                
                I  <span class="title-text">APPOINT</span> [LAW FIRM NAME] [UEN NO.], of [address] to be the sole trustee of this my Will (“my Trustee”).
                
                </td>
              <td>First Trustee FREE
    
                $50 per additional trustee
                
                
                $75 if a law firm is appointed as trustee
                
                *For appointment of a law firm as trustee, please refer to the law firm’s schedule of future costs in acting as trustee
                
                </td>
          </tr>
          <tr>
              <td>Appointment of joint trustees</td>
              <td>I  <span class="title-text">APPOINT</span>
                <div class="list-wrapper">
                    <span class="title-text">[TRUSTEE NAME 1] [NRIC NO.], of [address]</span>
                    <span class="title-text">[TRUSTEE NAME 1] [NRIC NO.], of [address]</span>
                    <span class="title-text">[TRUSTEE NAME 1] [NRIC NO.], of [address]</span>
                    <span class="title-text">[TRUSTEE NAME 1] [NRIC NO.], of [address]</span>
                    </div>
                , to be the joint trustees of this my Will (“my Trustees”). 
    
    
            </td>
              <td></td>
          </tr>
          <tr>
              <td>Joint trustees to act jointly or jointly and severally 
            </td>
              <td>My Trustee/s shall act [jointly]/[jointly and severally].</td>
              <td></td>
          </tr>
          <tr>
              <td>Appointment of replacement trustee/s
            </td>
              <td>If the above-named Trustee/s shall predecease me or shall be unable to act, then I  <span class="title-text">APPOINT</span> <div class="">
                  <span class="title-text">[NAME OF REPLACEMENT TRUSTEE 1] [NRIC NO.], of [address], [NAME OF REPLACEMENT TRUSTEE 2] [NRIC NO.], of [address], [NAME OF REPLACEMENT TRUSTEE 3] [NRIC NO.], of [address] and [NAME OF REPLACEMENT TRUSTEE 4] [NRIC NO.], of [address] 
              </div></span>as the replacement trustee/s of this my Will who shall act <span class="title-text">[solely]/[jointly]/[jointly and severally]</span>. I declare that in this Will, the expression “my Trustee/s” shall, where the context admits, include the replacement trustee/s of this Will.
            </td>
              <td>$50 per replacement trustee</td>
          </tr>
          <tr>
              <td>Remuneration of Trustee/s
            </td>
              <td>Any Trustee who is not a beneficiary of this Trust will receive reasonable compensation out of the resources of the Trust for services rendered. A Trustee who is also a beneficiary under this Trust will serve without compensation.
    
                OR
                
                A Trustee is entitled to remunerated out of the income and property of this Trust for any and all of the Trustee’s fees, which shall be reasonable.
                </td>
              <td></td>
          </tr>
          <tr>
              <td>
                TRUSTEE POWERS
                </td>
              <td>
                * Trustee powers are the powers to be given to the trustee(s) in managing the trust assets. The Trustee(s) is/are not required to consult with the trust beneficiaries in managing the trust assets. Trustees are generally not liable for  loss unless caused by fraud or negligence. They set out the scope of responsibilities that you want your trustees to have. 
                </td>
              <td></td>
          </tr>
          <tr>
              <td>Trustee Powers
            </td>
              <td>I  <span class="title-text">EMPOWER</span>  my Trustees to use their discretion to: 
    <ul>
        <li> employ and rely on the advice of experts including, but not limited to, legal counsel, accountants and investment advisors to assist in the management of the trust and to be reimbursed out of the income and property of the trust for any and all expenses, including interest where appropriate, where the expense is reasonably and properly incurred in the management of the Trust.</li>
        <li>    appoint a suitable replacement Trustee at any time where the Trustee is no longer able to act as Trustee for any reason. </li>
        <li>
            sell, call in and convert into money any and all property belonging to the trust, both movable and immovable, with the power to postpone the sale, calling in and conversion as the Trustee deems reasonable and in the best overall interest of the trust, without liability for loss or depreciation.</li>
        <li> 
            insure, repair, improve, or add to or otherwise deal with any and all property belonging to the trust, both movable and immovable, as the Trustee deems reasonable and in the best overall interest of the trust, without liability for loss or depreciation.
            </li>
        <li>   purchase, maintain, convert and liquidate investments or securities, at reasonable risk, and for the purpose of generating income and growth, and vote stock in person or by proxy, or exercise any option concerning any investments or securities, as the Trustee deems reasonable and in the best overall interest of the trust, without liability for loss or depreciation. </li>
        <li>
            deposit monies into safe bank accounts but shall not make any investments.  
    
        </li>
        <li>
       
            apply the trust assets towards the emergency or reasonable medical expenses of my trust beneficiary/ies within the relevant trust period.
                
        </li>
        <li>
            apply the trust assets towards the educational needs of my trust beneficiary/ies within the relevant trust period.
    
        </li>
        <li>
            apply the trust assets towards purchasing life insurance policies on behalf of my trust beneficiary/ies within the relevant trust period.
        </li>
        <li>
            adjust each payout made to a trust beneficiary from the trust, taking into account inflation rates from the date of the signing of this Will.
        </li>
        <li>
                 
            withhold or advance any payouts from the trust to my trust beneficiary/any of my beneficiaries. 
        </li>
    </ul>
               
           
                </td>
              <td></td>
          </tr>
          <tr>
              <td class="title-text">
                RESIDUAL GIFTS 
                </td>
              <td>*The residuary estate is the balance portion remaining after all the debts have been paid and all the specific gifts have been made. 
    
                The residual gift may be distributed to the beneficiary/ies forthwith or paid into a testamentary trust for delayed distribution. 
                </td>
              <td></td>
          </tr>
          <tr>
              <td>Residual Asset to be distributed
              <span class="title-text">  (if there are specific gift selected show purple text)</span>
                
                </td>
              <td>[Subject to the above legacies and in respect of my residuary estate, payments] I <span class="title-text">
                   GIVE, DEVISE AND BEQUEATH 
              </span>all my movable and immovable property whatsoever and wheresoever situate which I may be possessed of or entitled to at my death (including any property over which I may have a power of appointment or disposition by will) to the following beneficiary/ies in the following proportions:
    <ul>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP] [NAME OF BENEFICIARY 1] [NRIC No.];
            </span> 
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP] [NAME OF BENEFICIARY 2] [NRIC No.];</span> 
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP] [NAME OF BENEFICIARY 3] [NRIC No.]; </span> 
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP] [NAME OF BENEFICIARY 4] [NRIC No.]; and</span> 
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP]  [NAME OF BENEFICIARY 5] [NRIC No.]. </span>
    
        </li>
    </ul>
                </td>
              <td>
                $25 per additional beneficiary (for additional beneficiaries beyond initial 3 beneficiaries)
                
                </td>
          </tr>
          <tr>
              <td>If checkbox opt 1 – child to substitute beneficiary who predeceases testator
    
    
    
            </td>
              <td>If any of the aforesaid beneficiaries shall die in my lifetime but leave behind a child/children, then such child of the predeceased beneficiary shall take by substitution absolutely, and if more than one child, then such children of the predeceased beneficiary shall take by substitution equally, the share of my estate which such predeceased beneficiary would be entitled to take if he or she had survived me.
            </td>
              <td>$75 for doing any replacement beneficiary clause  (generator-2.html > beneficiaries)
            </td>
          </tr>
          <tr>
              <td>If checkbox opt 2 – surviving beneficiaries to split proportionately.
            </td>
              <td>If any of the aforesaid beneficiaries shall die in my lifetime, then the share of my estate which such predeceased beneficiary would be entitled to take if he or she had survived me shall be distributed to my surviving beneficiary/ies proportionately. 
            </td>
              <td></td>
          </tr>
          <tr>
              <td>If checkbox opt 3 – if there is only one original beneficiary to receive the residual gift
    
                Replacement beneficiary </td>
              <td>If the above gift fails, then the following replacement beneficiaries shall take in the following proportions: -
    <ul>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP] [NAME OF REPLACEMENT BENEFICIARY 1] [NRIC No.];
            </span> 
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP] [NAME OF REPLACEMENT BENEFICIARY 2] [NRIC No.];</span> 
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP] [NAME OF REPLACEMENT BENEFICIARY 3] [NRIC No.];</span>  
    
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP] [NAME OF REPLACEMENT BENEFICIARY 4] [NRIC No.]; and
            </span> 
        </li>
        <li>
            <span class="title-text">[percentage]</span> to my <span class="title-text">[RELATIONSHIP] [NAME OF REPLACEMENT BENEFICIARY 5] [NRIC No.]. </span> 
    
        </li>
    </ul>
                </td>
              <td>$25 per replacement beneficiary</td>
          </tr>
          <tr>
              <td>If(delayedPayout.checked == true)
    
            </td>
              <td>Beneficiaries = 1
                  <br>
                I DIRECT that my gift to <span class="title-text">[NAME OF BENEFICIARY] [NRIC No.]</span> shall be managed by my <span class="title-text">[executor(s)/guardian(s)]</span> who shall at his/her/their sole discretion apply such gift towards the maintenance, educational needs, and urgent or reasonable medical expenses of [NAME OF BENEFICIARY], and to pay out any balance remaining in such gift to <span class="title-text">[NAME OF BENEFICIARY]</span>  upon <span class="title-text">[NAME OF BENEFICIARY] </span> attaining the age of <span class="title-text">[30]</span> years.
    
                <br>
                <br>
                OR
                <br>
                <br>
                
                Beneficiaries > 1
                <br>
                I DIRECT that my gifts to <span class="title-text">[NAME OF BENEFICIARY 1] [NRIC No.], [NAME OF BENEFICIARY 2] [NRIC No.], [NAME OF BENEFICIARY 3] [NRIC No.] and [NAME OF BENEFICIARY 4] [NRIC No.] </span>shall be managed by my <span class="title-text">[executor(s)/guardian(s)]</span> who shall at his/her/their sole discretion apply each gift towards the maintenance, educational needs, and urgent or reasonable medical expenses of the respective beneficiaries, and to pay out any balance remaining in each gift to the respective beneficiary in respect of each beneficiary when he/she on the day that the respective beneficiary attains the age of <span class="title-text">[30]</span> years.
                </td>
              <td>$75 per delayed payout per beneficiary</td>
          </tr>
          <tr>
              <td class="title-text">
                ENDING
                </td>
              <td></td>
              <td></td>
          </tr>
          <tr>
              <td>Provide for inaccuracies in descriptions</td>
              <td>I <span class="title-text">DECLARE</span>  that in this my Will, where descriptions of property, bank accounts or assets have been provided, these descriptions are to the best of my knowledge and information and are meant to assist my (Trustees/Executors) in carrying out their duties, but should there be any inaccuracy in any of these descriptions, the inaccuracy shall not render any of the gifts made herein in this my Will void or null.
            </td>
              <td>FREE
            </td>
          </tr>
          <tr>
              <td>Provide avenue to seek clarification or assistance from financial planner</td>
              <td>I <span class="title-text">DIRECT</span>   that my Executors and/or Trustees may procure clarifications and/or assistance from <span class="title-text">[financial advisor]</span> of <span class="title-text">[institution] (email:___ / hp:____)</span> who has assisted me with financial planning.
            </td>
              <td></td>
          </tr>
          <tr>
              <td>Declaration that will is not for any unnamed person
            </td>
              <td>I <span class="title-text">DECLARE</span> that I am not making any provision for any other person(s) not named herein, as it is not my wish and/ or intention to give any share or interest to any person(s) not named herein.</td>
              <td></td>
          </tr>
          <tr>
              <td>Signing / witnessing clause
    
            </td>
              <td><span class="title-text">SIGNED</span>  by the abovenamed <span class="title-text">[TESTATOR]</span>  as the Testator’s last will in the presence of us both present at the same time who at his/her request in his/her presence and in the presence of each other have hereunto subscribed our names as witnesses:-
                <div class="witness-container">
                <div> <span class="title-text">[NAME OF WITNESS 1]    </span>                 <span class="title-text">[NAME OF WITNESS 2]</span></div>
                <div> <span class="title-text">[NAME OF WITNESS 1]    </span>                 <span class="title-text">[NAME OF WITNESS 2]</span></div>
                <div> <span class="title-text">[NAME OF WITNESS 1]    </span>                 <span class="title-text">[NAME OF WITNESS 2]</span></div>
                <div> <span class="title-text">[NAME OF WITNESS 1]    </span>                 <span class="title-text">[NAME OF WITNESS 2]</span></div>
                   
                </div>
                </td>
              <td></td>
          </tr>
         
        </table>
      </body>
    </html>
    `
  return {
      html
    };
  }
  catch(err){
    return err.message
  }
}

exports.getWillInfo = async(req,res)=>{
  try {
  const data = await Will.findById(req.params.id)
  
  res.json({
    message : "data found successfully",
    success : true,
    data : data
  })
  }catch(err){
    req.json({
      message : "something went wrong",
      success : false,
      error : err.message
    })
  }
}