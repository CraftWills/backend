const bcrypt = require("bcrypt");
// const momen = require("moment-timezone");

require("dotenv").config();
// const ExpressError = require("../Errorgenerator/errorGenerator");
const { generateAccessToken } = require("../../JsonWebToken/jwt");
const WillDataAccess= require("../../dal/Will/will.dal");
const Will = require ("../../models/Will/will.model");
const usersDataAccess= require("../../dal/user.dal");
const Trust = require ("../../models/trust.model")
const User = require("../../models/user.model");
const {myFunction} = require ("../../nodemailer/nodemailer");
const date = require ("date-and-time");
var todayDate=(date.format(new Date(), 'MM-DD-YYYY'));
const member = require("../../models/members.model");
var count = 0
const ObjectId = require('mongoose').Types.ObjectId;
var pdf = require("pdf-creator-node");
var fs = require("fs");

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
    const willData = req?.body?.formattedData;
    const {executors, trust, residualAsset} = willData;
    
    const executor = `
    <tr>
            <td class="sub-heading  heading-style">EXECUTOR</td>
          </tr>
          <tr>
            <td  class="para para-style"> I APPOINT ${executors?.primaryExecutor?.name} (${executors?.primaryExecutor?.id_type} No. ${executors?.primaryExecutor?.id_number}), of ${executors?.primaryExecutor?.address?.unitNumber + ' ' + executors?.primaryExecutor?.address?.streetName}, ${executors?.primaryExecutor?.address?.country}
                ${executors?.primaryExecutor?.address?.postalCode}, ${executors?.primaryExecutor?.address?.country} to be the ${executors?.primaryTrusteeType} executor of this my Will (hereinafter
                called “my Executor”). </td>
          </tr>
    `

    const guardian = `
    <tr>
    <td class="sub-heading  heading-style">GUARDIAN</td>
  </tr>
  <tr>
    <td  class="para para-style"> If the other parent of my child/ren has predeceased me or shall not
        survive me, I APPOINT ${executors?.guardianExecutor?.name} (${executors?.guardianExecutor?.id_Type} No. ${executors?.guardianExecutor?.id_number}), of ${executors?.guardianExecutor?.address?.unitNumber + ' ' + executors?.guradianExecutor?.address?.streetName}, ${executors?.guardianExecutor?.address?.country} to be the guardian/s of my child/ren
        during their minority to act solely.</td>
  </tr>
    `
  const Trust = 
  `
  <tr>
  <td class="sub-heading  heading-style">TRUST</td>
</tr>


<tr>
  <td class="s3" style="padding-left: 5pt; text-indent: 0pt; text-align: left">Tsang&#39;s Family TRUST</td>
</tr>
</tbody>
<tfoot>
<tr>
  <td class="signature-box">
      <div>
          <p>Signature of Testator </p>
      </div>
      <div>    <p>Signature of Testator </p></div>
      <div>    <p>Signature of Testator </p></div>
  </td>
</tr>
</tfoot>
<tr>
    <td>
        I APPOINT 
    </td>
</tr>
${trust.map((el) => {
  return `<tr>
            <td  class="para para-style">  ${el?.primaryTrustee?.members?.name} (${el?.primaryTrustee?.type} No. ${el?.primaryTrustee?.members?.id_number}), of ${el?.primaryTrustee?.members?.address?.streetName},${el?.primaryTrustee?.members?.address?.floorNumber} ${el?.primaryTrustee?.members?.address?.country}
               ${el?.primaryTrustee?.members?.address?.postalCode}, ${el?.primaryTrustee?.members?.address?.country} to be the ${el?.primaryTrustee?.type} Trustee of this my Will (“${el?.primaryTrustee?.members?.name}”).</td>
          </tr>`
}).join(',')}

<tr>
  <td  style="
  padding-top: 11pt;
  padding-left: 5pt;
  text-indent: 0pt;
  line-height: 152%;
  text-align: justify;
" > <p>

    I GIVE my immovable property known as ${trust[0]?.trustDetails?.trustName}, ${trust[0]?.primaryTrustee?.members?.address?.country} 
    ("${trust[0]?.trustDetails?.description}") to my Trustee/s to
    hold UPON Trust (the “${trust[0]?.trustDetails?.trustName}”) for the
    following Trust beneficiary/ies in the following proportion/s:</td>
  </p>
</tr>
<tr>
  <td  >  <ol id="l1">
  <li data-list-text="i.">
    <p
      class=""
    >
      100% to my son, TIMOTHY TSANG (NRIC No. S9714999B).
    </p>
    
    <p
      style="
        padding-left: 5pt;
        text-indent: 0pt;
        line-height: 152%;
        text-align: justify;
      "
    >
      The Trust Period of the Tsang&#39;s Family Property Trust shall be
      from the date of my death to the earlier of (i) the date when the
      Trustee/s sell or dispose of the Tsang&#39;s Family Property with the
      consent of TIMOTHY TSANG (NRIC No. S9714999B), of 8 Taman Siglap,
      Singapore 455669, Singapore or (ii) 99 years from the date of my death
      (the “Tsang&#39;s Family Property Trust Period”).
    </p>
    <p
      style="
        padding-top: 12pt;
        padding-left: 5pt;
        text-indent: 0pt;
        line-height: 151%;
        text-align: justify;
      "
    >
      At the expiry of the Tsang&#39;s Family Property Trust Period, the
      Tsang&#39;s Family Property may be transferred to or may be sold with
      the sale proceeds distributed to the aforesaid beneficiary/ies in the
      aforesaid proportion/s.
    </p>
    
    <p
      style="
        padding-left: 5pt;
        text-indent: 0pt;
        line-height: 151%;
        text-align: justify;
      "
    >
      If any of the aforesaid Trust beneficiaries shall die before the
      expiry of the Tsang&#39;s Family Property Trust Period, then my
      surviving Trust beneficiary/ies shall take proportionately.
    </p>
    
    <p
    class="para-style"
   >
      A Trustee is entitled to remunerated out of the income and property of
      this Trust for any and all of the Trustee’s fees, which shall be
      reasonable.
    </p>
    
    <p style="padding-left: 5pt; text-indent: 0pt; text-align: justify">
      I EMPOWER my Trustee/s to use their discretion to:
    </p>
    
    <ul id="l2">
      <li data-list-text="-">
        <p
         class="para-style"
        >
          employ and rely on the advice of experts including legal counsel,
          accountants and investment advisors to assist in the management of
          the Trust and to be reimbursed out of the income and property of
          the Trust for any and all expenses where such expense is
          reasonably and properly incurred in the management of the Trust.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style"
        >
          appoint a suitable replacement Trustee at any time where the
          Trustee is no longer able to act as Trustee for any reason.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style"
        >
          purchase, maintain, convert and liquidate investments or
          securities, at reasonable risk, and for the purpose of generating
          income and growth, or exercise any option concerning any
          investments or securities, as the Trustee deems reasonable and in
          the best overall interest of the Trust, without liability for loss
          or depreciation.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style"
        >
          insure, repair, improve, or add to or otherwise deal with any and
          all property belonging to the Trust, both movable and immovable,
          as the Trustee deems reasonable and in the best overall interest
          of the Trust, without liability for loss or depreciation.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style"
        >
          sell, call in and convert into money any and all property
          belonging to the Trust, both movable and immovable, with the power
          to postpone the sale, calling in and conversion as the Trustee
          deems reasonable and in the best overall interest of the Trust,
          without liability for loss or depreciation.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style"
        >
          deposit monies into safe bank accounts but shall not make any
          investments.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style"
        >
          apply the Trust assets towards the emergency or reasonable medical
          expenses of my Trust beneficiary/ies within the relevant Trust
          period.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style"
        >
          apply the Trust assets towards the educational needs of my Trust
          beneficiary/ies within the relevant Trust period.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style"
        >
          apply the Trust assets towards purchasing life insurance policies
          on behalf of my Trust beneficiary/ies within the relevant Trust
          period.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style"
        >
          adjust each payout made to a Trust beneficiary from the Trust,
          taking into account inflation rates from the date of the signing
          of this Will.
        </p>
        
      </li>
      <li data-list-text="-">
        <p
        class="para-style">
          withhold or advance any payouts from the Trust to any of my Trust
          beneficiaries
        </p>
      </li>
    </ul>
  </li>
</ol></td>
</tr>
  `
const residualEstate = `
<tr>
<td class="sub-heading heading-style">
    RESIDUAL ESTATE</td>
</tr>
<tr>
<td  class="para para-style"> Subject to the above legacies and in respect of my residuary estate, I
    GIVE, DEVISE AND BEQUEATH all my movable and immovable property
    whatsoever and wheresoever situate which I may be possessed of or
    entitled to at my death (including any property over which I may have
    a power of appointment or disposition by will) to the following
    beneficiary/ies in the following proportion/s:</td>
</tr>

<tr>

`

const ending = `
<tr>
<td class="sub-heading heading-style">
   ENDING</td>
</tr>
<tr>
<td  class="para para-style"> Subject to the above legacies and in respect of my residuary estate, I
    GIVE, DEVISE AND BEQUEATH all my movable and immovable property
    whatsoever and wheresoever situate which I may be possessed of or
    entitled to at my death (including any property over which I may have
    a power of appointment or disposition by will) to the following
    beneficiary/ies in the following proportion/s:</td>
</tr>

<tr> <td class="para para-style">I DIRECT that my Executor/s and/or Trustee/s may procure clarifications
and/or assistance from LUCAS SOH of Characterist LLC (email:<a href="mailto:lucas@characterist.com" class="a" target="_blank"

>lucas@characterist.com </a>/ hp: 97396586) who has assisted me with financial
planning.</td>
</tr>

<tr> <td class="para para-style">I DECLARE that I am not making any provision for any other person(s) not
named herein, as it is not my wish and/ or intention to give any share or
interest to any person(s) not named herein.</td>
</tr>
<tr>
  <td>
      <br>
  </td>
</tr>`
  
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
        <style type="text/css">
            table{
    padding: 40px;
            }
           
            .sub-heading{
                color: #000;
            font-family: Georgia, serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 12.5pt;
    
            }
            .heading-style{
                padding-top: 11pt;
                padding-left: 5pt;
                text-indent: 0pt;
                text-align: left;
            }
            .para,p{
                color: #151515;
                font-family: Georgia, serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 14pt;
                margin: 0pt;
            
            
            }
            .para-style{
                padding-left: 5pt;
                padding-top: 11pt;
                text-indent: 0pt;
                line-height: 152%;
                text-align: justify;
            }
            .s3 {
                color: black;
                font-family: Georgia, serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 10.5pt;
              }
              li {
                display: block;
              }
              #l1 {
                padding-left: 0pt;
                counter-reset: c1 1;
              }
              #l1 > li > *:first-child:before {
                counter-increment: c1;
                content: counter(c1, lower-roman) ". ";
                color: #151515;
                font-family: Georgia, serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 12pt;
              }
              #l1 > li:first-child > *:first-child:before {
                counter-increment: c1 0;
              }
              #l2 {
                padding-left: 0pt;
              }
              #l2 > li > *:first-child:before {
                content: "- ";
                color: #151515;
                font-family: Georgia, serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 12pt;
              }
              #l3 {
                padding-left: 0pt;
                counter-reset: c2 1;
              }
              #l3 > li > *:first-child:before {
                counter-increment: c2;
                content: counter(c2, lower-roman) ". ";
                color: #151515;
                font-family: Georgia, serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 12pt;
              }
              #l3 > li:first-child > *:first-child:before {
                counter-increment: c2 0;
              }
              .h3 {
                color: #151515;
                font-family: Georgia, serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 12pt;
              }
              .signature-box{
    display: flex;
    margin-top: 5px;
              }
              .signature-box div{
                border: 1px solid #000;
                border-radius: 3px;
                width: 100%;
                font-size: 11px;
                /* margin: 14px; */
                height: 80px;
                padding: 6px;
            
              }
              .signature-box div p{
                font-size: 13px;
            
              }
              .signature-box div:nth-child(2){
                    margin: 0 50px;
            
              }
              .s5{
                width: 70%;
                margin-left: 7px;
                background: #b6b6b6;
                height: 1px;
                margin-bottom: 0;
                margin-top: 22px;
              }
    
        </style>
      </head>
    
      <body class="mat-typography">
        <table>
            <thead>
                <tr>
                    <td>
                      <hr style="height:2px;border-width:0;color:#000;background-color:#000">
                    </td>
                </tr>
                <tr>
                    <tr>
                        <td  style="padding-top: 0;display: flex;justify-content: space-between; align-items: center;">
                            <div class="sub-heading heading-style" style="padding-top: 0;">
                                THE LAST WILL AND TESTEMENT OF <br> <span style="font-size: 15px;margin-top: 3px;">TIMOTHY TSANG WEI SHAN</span>
                            </div>  
                            <div>Craftwills logo</div>
                        </td>
                      <td>
                          
                      </td>
                      </tr>
                </tr>
                <tr>
                    <td>
                        <hr style="height:2px;border-width:0;color:#000;background-color:#000">
                    </td>
                </tr>
              </thead>
              <tbody>
          <tr>
            <td class="sub-heading heading-style">
          INTRODUCTION</td>
          
          </tr>
          <tr>
            <td  class="para para-style">I, TIMOTHY TSANG WEI SHAN (NRIC No. S9905831E), of 8 Taman Siglap,
                Singapore 455669, HEREBY REVOKE all former wills, codicils and
                testamentary dispositions hereinbefore made by me AND DECLARE this to be
                my Last Will and Testament (hereinafter called my “Will”). This Will
                covers all my movable and immovable property whatsoever and wheresoever
                situate which I may be possessed of or entitled to at my death (including
                any property over which I may have a power of appointment or disposition
                by will).</td>
          </tr>
          ${executor} <br>
       
          
          <tr>
            <td class="sub-heading  heading-style">PROVISION FOR DEBTS AND EXPENSES</td>
          </tr>
          <tr>
            <td class="para para-style">  I DIRECT that all my just debts, funeral and testamentary expenses, estate
                duty payable in respect of my estate, and any other expenses that may be
                reasonably incurred upon or by reason of my death, be paid out of my
                estate.</td>
          </tr>
        
        ${guardian}<br
        ${Trust} <br>
        ${residualEstate} <br>
        ${ending}

          
        
          <tr> <td class="para para-style"> ------------------ THE REST OF THE PAGE IS INTENTIONALLY LEFT BLANK
            -----------------------</td>
          </tr> 
          
          <tr> <td class="para para-style" style="white-space: nowrap; display:flex;"><span style="font-weight: bold;margin-right: 10px;">IN WITNESS WHERE OF </span><br><span class="p">I have here unto set my hand this </span
            ><div class="s5">&nbsp;&nbsp; </div>
            <span class="p"> day of</span> <br> 
            <div class="s5">&nbsp;&nbsp; </div>
            <span class="p">(month) </span>
            <div class="s5">&nbsp;&nbsp; </div>
            <span class="p">(year).</span>
        </td>
          </tr> 
          
          <tr> <td class="para para-style">  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        
        </td>
          </tr> 
          <tr>
            <td>
                <br>
                <br>
                <br>
                <br>
            </td>
        </tr>
          <tr> <td class="para para-style">
              <hr>
            (Signature of Testator)
          </td>
          </tr> 
          <tr> <td class="para para-style " style="display: flex;">
           <div  style="white-space: nowrap;"> Witness One Name:</div>
            <div class="s5">&nbsp;&nbsp;&nbsp;
            </div>
          </td>
          </tr> 
          <tr> <td class="para para-style " style="display: flex;">
            <div  style="white-space: nowrap;"> Witness One NRIC:</div>
             <div class="s5">&nbsp;&nbsp;&nbsp;
             </div>
           </td>
           </tr>
          <tr> <td class="para para-style ">
         <span class="h3">SIGNED</span>   
            <span class="p"
              >by the abovenamed as the Testator&#39;s last will in the presence of us
              both present at the same time who at his/her request in his/her presence
              and in the presence of each other have hereunto subscribed our names at
              witnesses: -</span
          </td>
          </tr> 
          <tr>
            <td>
                <br>
                <br>
                <br>
                <br>
            </td>
        </tr>
          <tr> <td class="para para-style">
              <hr>
            (Signature of Testator)
          </td>
          </tr> 
          <tr> <td class="para para-style " style="display: flex;">
            <div  style="white-space: nowrap;"> Witness One Name:</div>
             <div class="s5">&nbsp;&nbsp;&nbsp;
             </div>
           </td>
           </tr> 
           <tr> <td class="para para-style " style="display: flex;">
            <div  style="white-space: nowrap;"> Witness One NRIC:</div>
             <div class="s5">&nbsp;&nbsp;&nbsp;
             </div>
           </td>
           </tr>
          <tr>
            <td class="sub-heading heading-style">
                TRANSLATION
            </td>
          
          </tr>
          <tr>
            <td  class="para para-style">I hereby certify that I have read and explained the contents of this Will in the Mangalese
                language, which language and English I am fully conversant with, to the Testator before
                execution of this Will and the Testator appeared perfectly to understand and approve it.</td>
          </tr>
          <tr>
            <td>
                <br>
                <br>
                <br>
                <br>
            </td>
        </tr>
          <tr> <td class="para para-style">
            <hr>
          (Signature of Testator)
        </td>
        </tr> 
        <tr> <td class="para para-style " style="display: flex;">
            <div  style="white-space: nowrap;"> Witness One Name:</div>
             <div class="s5">&nbsp;&nbsp;&nbsp;
             </div>
           </td>
           </tr> 
        <tr> <td class="para para-style " style="display: flex;">
            <div  style="white-space: nowrap;"> Witness One NRIC:</div>
             <div class="s5">&nbsp;&nbsp;&nbsp;
             </div>
           </td>
           </tr> 
        </table>
      </body>
    </html>
     `
 var options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
      header: {
          height: "45mm",
          contents: '<div style="text-align: center;">Author: Lucas liao </div>'
      },
      footer: {
          height: "28mm",
          contents: {
              first: 'Cover page',
              2: 'Second page', // Any page number is working. 1-based index
              default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
              last: 'Last Page'
          }
      }
  };

  var document = {
    html: html,
    path: "./output.pdf",
    type: "",
    data: {}
  };

  return pdf.create(document , options).then(async res =>{
    console.log('...',res)
    return  (res)
  }).catch(error =>{
      console.log("Error creating pdf",error)
      return reject(error);
  })

  }
  catch(err){
    return err.message
  }
}

exports.getWillInfo = async(req,res)=>{
  try {
  const data = await Will.find({user_id: "624e84a65e9471c649140d96"})
  let primaryExecutorData = data.map(el=> el.primaryExecutors)
let replacementExecutorsData = data.map(el=>el.replacementExecutors)
let guardianExecutorData = data.map(el=>el.guardianExecutor)
let guardianReplacementExecutorData = data.map(el=>el.guardianReplacementExecutor)
console.log(primaryExecutorData)
console.log(replacementExecutorsData)
console.log(guardianExecutorData)
console.log(guardianReplacementExecutorData)
  res.json({
    message : "data found successfully",
    success : true,
    data : data
  })
  }catch(err){
    res.json({
      message : "something went wrong",
      success : false,
      error : err.message
    })
  }
}