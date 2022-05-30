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
const axios = require('axios');

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


if (savedData){

    const memberIds = []
     
    const data = await member.find({user_id:_id})
    data.forEach(async(el)=>{
      memberIds.push(el._id)
      const Willdata = await Will.find({"member":el._id});
      console.log(Willdata)
    })

    console.log(memberIds)

  }
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


// Getting Will Details


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

/// Past Will Versions

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

//////
exports.generatePdf = async(req,res)=>{
  try{
    
    let image = 'https://craftwill.vercel.app/assets/Image/Logo/Craftwills..png';
    if (image && image.startsWith('http')) {
      const base64 = Buffer.from((await axios.get(image, {
        responseType: "arraybuffer"
      })).data, "utf-8").toString("base64");
      image = `data:image/png;base64,${base64}`;
    }
    const willData = req?.body?.formattedData;
    console.log("final data :=== ",willData)
    
    const {executors, trust, residualAsset} = willData;
    const cover = `
    <div style="width:100%; height:100vh; margin-top:400px; display:flex; align-items:center; justify-content:center">
        <div style="text-align:center ;">
            <div style="display:flex; margin-bottom: 100px;  margin-top: 100px;">
                <p style="height: 40px;font-size: 20px; margin-right: 10px;">Dated This</p>
                <input type="text"bottom
                    style="border:none; border-bottom: 1px solid black; height: 40px; width: 200px;font-size: 20px; text-align: center;" />
            </div>

            <img src="${image} "width="400" height="100">
            <p style="color:black; font-size: 25px; margin-top: 100px;">The Last Will and Testament Of</p>
            <p style="color:black; font-size: 25px;">${willData?.user?.fullname}</p>
            <p style="color:black;font-size:25px">(${willData?.user?.id_type} ${willData?.user?.id_number})</p>
        </div>
    </div>`
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

    const guardian = executors?.guardianExecutor ? `
    <tr>
    <td class="sub-heading  heading-style">GUARDIAN</td>
  </tr>
  <tr>
    <td  class="para para-style"> If the other parent of my child/ren has predeceased me or shall not
        survive me, I APPOINT ${executors?.guardianExecutor?.name} (${executors?.guardianExecutor?.id_type} No. ${executors?.guardianExecutor?.id_number}), of ${executors?.guardianExecutor?.address?.unitNumber}  ${executors?.guardianExecutor?.address?.streetName}, ${executors?.guardianExecutor?.address?.country} to be the guardian/s of my child/ren
        during their minority to act solely.</td>
  </tr>
    ` : ''
  const Trust = trust?.length ?
  `
  <tr><td class="sub-heading  heading-style">TRUST</td></tr>
  <tr><td class="s3" style="padding-left: 5pt; text-indent: 0pt; text-align: left">${trust.map((el)=>el?.trustDetails?.trustName).join(",")}</td></tr>
  </tbody>
<tr>
    <td>
        I APPOINT
    </td>
</tr>
${trust.map((el) => {
 
   if (el?.primaryTrustee?.type==="joint"|| el?.primaryTrustee?.type==="jointlyAndSeverally" )
  el?.primaryTrustee?.members.map(dta=>{
    return dta?.name ? `<tr>
      <td  class="para para-style">(${dta?.name} ${ el?.primaryTrustee?.type} No. ${dta?.id_number}), of ${dta?.address?.streetName},${dta.address?.floorNumber} ${dta.address?.country}
         ${dta?.address?.postalCode}, ${dta?.address?.country} to be the ${el?.primaryTrustee?.type} Trustee of this my Will (“${dta?.name}”).</td>
    </tr>`
    :""}).join('')
  else{
    return el?.primaryTrustee?.members.length ? `<tr>
    <td  class="para para-style">${ el?.primaryTrustee?.members[0]?.name} (${el?.primaryTrustee?.type} No. ${el?.primaryTrustee?.members[0]?.id_number}), of ${el?.primaryTrustee?.members[0]?.address?.streetName},${el?.primaryTrustee?.members[0]?.address?.floorNumber} ${el?.primaryTrustee?.members[0]?.address?.country}
       ${el?.primaryTrustee?.members[0]?.address?.postalCode}, ${el?.primaryTrustee?.members[0]?.address?.country} to be the ${el?.primaryTrustee?.type} Trustee of this my Will (“${el?.primaryTrustee?.members[0]?.name}”).</td>
  </tr>` : ""
  }
}).join('')
}

<tr>
  <td  style="
  padding-top: 11pt;
  padding-left: 5pt;
  text-indent: 0pt;
  line-height: 152%;
  text-align: justify;
" > <p> 

I GIVE my immovable property known as ${trust.map((el) => el? `${el.trustDetails?.trustName}`:"").join(',')}, ${trust[0]?.primaryTrustee?.members.map((el2)=>el2.address?.country)} 
("${trust.map((el)=>el? `${el?.trustDetails?.description}`: "").join(",")}") to my Trustee/s to
hold UPON Trust (the “${trust.map((el)=>`${el?.trustDetails?.trustName}`).join(',')}”) for the
following Trust beneficiary/ies in the following proportion/s:</td>
</p>
</tr>
<tr>
  <td  >  <ol id="l1">
  <li data-list-text="i.">
    <p
      class=""
    >
      My ${trust.map((el)=>el? el.primaryTrustee?.members.map((el2)=>`${el2?.Relationship} ${el2?.name} of (${el2?.id_type} No ${el2?.id_number})`): "").join(",")} .
    </p>
    
    <p
      style="
        padding-left: 5pt;
        text-indent: 0pt;
        line-height: 152%;
        text-align: justify;
      "
    >
      The Trust Period of the ${trust.map((el)=> el? el?.trustDetails?.trustName : "").join(",")} shall be
      from the date of my death to the earlier of (i) the date when the
      Trustee/s sell or dispose of the ${trust.map((el)=>el? el?.trustDetails?.trustName :"").join(",")} with the
      consent of ${trust.map((el)=>el?.primaryTrustee?.members.map((el2)=>el2 ? `${el2?.name} (${el2?.id_type} No ${el2?.id_number} of ${el2?.address?.streetName} ${el2?.address?.postalCode} ${el2?.address?.country} )`:"" )).join(",")}  ), or (ii) ${trust.map((el)=>el?.trustAge).join(",")} years from the date of my death
      (the “${trust.map((el)=>el? el?.trustDetails?.trustName : "").join(",")} Period”).
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
      At the expiry of the ${trust.map((el)=>el?.trustDetails?.trustName).join(",")} Period, the
      ${trust.map((el)=>el?.trustDetails?.trustName).join(",")} may be transferred to or may be sold with
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
      expiry of the ${trust.map((el)=>el?.trustDetails?.trustName).join(",")} Period, then my
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
  <p> 
<ul id="l2">
     ${trust?.map((el)=>el?.trusteePowers?.map((powers)=>powers? `  <li data-list-text="-">
     <p
      class="para-style"
     >-${powers}<br>`:"").join(""))}
     </p>
        </li>
      
</ol></td>
</tr>
  ` : ``
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
<tr>
  <td>
    <br>
  </td>
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

const witness = `
  <table class="witness-table">
    <thead>
      <tr>
        <td class='text-center head-row' colspan='4'>
          Witness
        </td>
      </tr>
    </thead>
    <tbody>
      <tr style='height:10px'></tr>
      <tr>
        <td style='padding-left:10px'>Witness Name:</td>
        <td><input type="text" class="input"></td>
        <td class="space">NRIC:</td>
        <td style='padding-right:10px'><input type="text" class="input"></td>
      </tr>
      <tr>
        <td colspan="4"  style='padding: 10px' >
        	<input style="height: 70px;width:99%;" type='text' class='input'>
        </td>
      </tr>
    </tbody>
  </table>
`
  
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

              html {
                zoom: 0.753;
                margin: 0;
                padding: 0;
              }

              .witness-table {
                padding: 0 !important;
                background-color: #f9fff7;
                color: #000;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
              }
              
              .input {
                border: 1px solid #dce0e4;
                background-color: white;
                border-radius: 5px;
                height: 25px;
              }
              
              .space {6p
                padding-left: 10px;
              }
              
              .head-row {
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                font-weight: bold;
                padding-top:7px;
                padding-bottom:7px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
              }
              
              .text-center {
                text-align: center;
              }
              
              thead {
                width: 100%;
                background-color: #ebebeb;
                
              }

        </style>
      </head>
      <body>
            <div class="cover-page">${cover}</div>

            <div style='height: 6in; width: 100%'></div>

            </body>
     
      <body style='margin-top: 0px; padding: 0px;' class="mat-typography">

      <table style="margin-top: 0px; padding-top: 0px !important;">
      <tbody>
          <tr>
            <td class="sub-heading heading-style" style="padding-top: 0px;">INTRODUCTION</td>
          </tr>
          <tr>
            <td  class="para para-style">I, ${willData?.user?.fullname} (${willData?.user?.id_type} No. ${willData?.user?.id_number}), of ${willData?.user?.address?.streetName},${willData?.user?.address?.floorNumber}
    ${willData?.user?.address?.country} ${willData?.user?.address?.postalCode}, HEREBY REVOKE all former wills, codicils and
                testamentary dispositions hereinbefore made by me AND DECLARE this to be
                my Last Will and Testament (hereinafter called my “Will”). This Will
                covers all my movable and immovable property whatsoever and wheresoever
                situate which I may be possessed of or entitled to at my death (including
                any property over which I may have a power of appointment or disposition
                by will).</td>
          </tr>
          <tr>
            <td>
            <br>
            </td>
          </tr>
          
          ${executor} 
          <tr>
            <td>
            <br>
            </td>
          </tr>
          <tr>
            <td class="sub-heading  heading-style">PROVISION FOR DEBTS AND EXPENSES</td>
          </tr>
          
          <tr>
            <td class="para para-style">  I DIRECT that all my just debts, funeral and testamentary expenses, estate
                duty payable in respect of my estate, and any other expenses that may be
                reasonably incurred upon or by reason of my death, be paid out of my
                estate.</td>
          </tr>
          <tr>
            <td>
            <br>
            </td>
          </tr>
        ${guardian}
        <tr>
            <td>
            <br>
            </td>
          </tr>
        ${Trust} 
        <tr>
            <td>
            <br>
            </td>
          </tr>
        ${residualEstate} 
        <tr>
            <td>
            <br>
            </td>
          </tr>
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
          
        <tr>
        ${witness}
        </tr>
        <tr>
            <td>
              <br>
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
            </td>
        </tr>
        <tr>
        ${witness}   
        </tr>
        <tr>
            <td>
              <br>
              <br>
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
            </td>
        </tr>
        <tr>
        ${witness}
        </tr>
        </table>

        <div><img src="${image}" style="display: none; width: 0px; height: 0px;"></div>
        </body>
    </html>
            <br><br>  <br> <br> <br> <br> <br> <br> <br>
            <br>

            <br>
     `
 var options = {
      format: "A3",
      orientation: "portrait",
      border: "0mm",
      header: {
          height: "30mm",
          contents: {
            first: '<br>',
            default: `
            <div class="Header" style='padding-left: 42px; padding-right: 42px;'>
            <hr style="height:2px;border-width:0;color:#000;background-color:#000">
              <table style='width: 100%; margin: 0; padding: 0;'>
                  <tr>
                    <td align='left' vAlign='top'>
                      <div class="" style="padding: 0;"> THE LAST WILL AND TESTEMENT OF <br> <span style="font-size: 15px;margin-top: 3px;">${willData?.user?.fullname}</span></div>
                    </td>
                    <td align='right' vAlign='center'>
                      <img src="${image}" style="width: 140px;">
                    </td>
                  </tr>
              </table>
              <hr style="height:2px;border-width:0;color:#000;background-color:#000">
            </div>`
          }
      },
      footer: {
          height: "35mm",
          contents: {
              first: `<br>`,
              default: `<div style='padding-left: 42px; padding-right: 42px; padding-top: 8px;'>
                  <table style='border-collapse: collapse; width: 100%; height: 110px; page-break-inside: avoid;'>
                      <tr>
                          <td style='height: 110px; padding-right: 16px;'><div style="border: 1px solid black; padding: 16px; padding-top: 4px; height:100%;">Signature of Testator </div></td>
                          <td style='height: 110px; padding-right: 16px; padding-left: 16px;'><div style="border: 1px solid black; padding: 16px; padding-top: 4px; height:100%;">Signature of Testator </div></td>
                          <td style='height: 110px; padding-left: 16px;'><div style="border: 1px solid black; padding: 16px; padding-top: 4px; height:100%;">Signature of Testator </div></td>
                      </tr>
                  </table>
              </div>`
          }
      }
  };

var document = {
    html: html,
    path: "./output.pdf",
    // type: "",
    type: 'buffer',
    data: {}
  };

  return pdf.create(document , options).then(async res =>{
    console.log('....',res)
    // return  (willData)
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
///// Get Will Info by id
exports.getWillInfo = async(req,res)=>{
  try {
  const data = await Will.find({user_id: "624e84a65e9471c649140d96"})
  let primaryExecutorData = data.map(el=> el.primaryExecutors)
let replacementExecutorsData = data.map(el=>el.replacementExecutors)
let guardianExecutorData = data.map(el=>el.guardianExecutor)
let guardianReplacementExecutorData = data.map(el=>el.guardianReplacementExecutor)

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

/// commiting changes