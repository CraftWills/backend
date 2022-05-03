const Members = require("../models/members.model");
const Trust = require("../models/trust.model");
const User = require("../models/user.model");
const Will = require("../models/Will/will.model");
 async function createWillData (req, res, next){
    try {
        const will = await Will.findById(req.params.id);
        if(will){
          let userID = will?.user_id;
          let newUser = await userDatas(userID);
          let P_E = will.primaryExecutors
          let peData = await memberDatas(P_E)
          let R_E = will.replacementExecutors
          let reData = await memberDatas(R_E)
          let G_E = will.guardianExecutor
          let geData = await memberDatas(G_E)
          let G_R_E = will.guardianReplacementExecutor
          let greData = await memberDatas(G_R_E)
          let primaryTrusteeType = will.trust[0].addTrust?.appointPrimaryTrustee?.specifyOwnershipType
          // let primaryTrusteeId = will.trust[0].addTrust?.appointPrimaryTrustee?.trustMembers
          // let primaryTrustee = await memberDatas(primaryTrusteeId)
          let replacementTrusteeType = will.trust[0].addTrust?.appointReplacementTrustee?.specifyOwnershipType
          // let replacementTrusteeId = will.trust[0].addTrust?.appointReplacementTrustee?.trustMembers
          // let replacementTrustee = await memberDatas(replacementTrusteeId)
          // let trustId = will.trust[0].trustData
          const trustDetails = await new Promise((res,rej) => {
            const arr = []
            will.trust.forEach(async(singleTrust, index) => {
              const newTrustData = await getTrustData(singleTrust);
              arr.push(newTrustData);
              if ((index + 1) === will?.trust.length) {
                res(arr);
              }
            }); 
          })
          console.log(trustDetails);

          const specifyResidualAssetBenificiary =  await new Promise((res, rej) => {
            const array = []
            will?.specifyResidualAssetBenificiary?.forEach( async(asset, index) => {
              const member = await memberDatas(asset?.member);
              array.push({
                member,
                share: asset?.specifyShares
              });


              if ((index + 1) === will?.specifyResidualAssetBenificiary.length) {
                res(array);
              }
            })


          })
          console.log(specifyResidualAssetBenificiary, 'benefici');
          // let trusteePow= will.trust[0].addTrust?.specifyTrusteePowers
          // let trusteePowers =  trusteePow.filter(el => el.isSelected=true)
          // let residualId = will?.specifyResidualAssetBenificiary[0]?.member
          // let residualAssetMem = await memberDatas(residualId)
          // let residualShares = will?.specifyResidualAssetBenificiary[0]?.specifyShares

          let formattedData = {
            user : newUser,
            executors : {
                primaryTrusteeType,
                primaryExecutor : peData,
                replacementTrusteeType,
                replacementExecutor : reData,
                guardianExecutor  : geData,
                guardianReplacementExecutor : greData
            },
            trust : trustDetails,
            residualAsset : specifyResidualAssetBenificiary
          }
          req.body['formattedData'] = formattedData;
          // return formattedData 
        }
        else {
            throw new Error('Will not found');
        }
        next();
    } catch (error) {
      next();
      throw new Error(error.message);
    }
}

async function memberDatas(id){
  let member = null;
    let data=  await Members.findById(id);
    console.log("something",data)
    if (data.type==="memberAsPerson"){
       member = {
         name : data?.memberAsPerson?.fullname,
         id_type: data?.memberAsPerson?.id_type,
         id_number : data?.memberAsPerson?.id_number,
         address : {
           streetName : data?.memberAsPerson?.streetName,
           floorNumber : data?.memberAsPerson?.floorNumber,
           unitNumber : data?.memberAsPerson?.unitNumber,
           postalCode : data?.memberAsPerson?.postalCode,
           country : data?.country
           
         }
       }
    }
    if (data.type ==="memberAsOrganisation"){
      member = {
        name  : data?.memberAsOrganisation?.organisationName ,
        id_number : data?.memberAsOrganisation?.registration_number,
        address : {
          streetName : data?.memberAsOrganisation?.streetName,
          floorNumber : data?.memberAsOrganisation?.floorNumber,
          unitNumber : data?.memberAsOrganisation?.unitNumber,
          postalCode : data?.memberAsOrganisation?.postalCode,
          country : data?.country
        }
      }
    }
    return member;
  
  }
  
  async function userDatas(id){
      try{
        const data = await User.findOne({_id:ObjectId(id)})
        return {
          ...data
        }
      } 
      catch(err){
        return err.message
      } 
  }
  
  async function getTrustData(trust){
    try{
      if(trust){
        let trustDetails = await Trust.findById(trust?.trustData);
        let primaryTrustee = {
          type: trust?.addTrust?.appointPrimaryTrustee?.specifyOwnershipType,
          members: trust?.addTrust?.appointPrimaryTrustee?.trustMembers?.map(async(mem) =>  {
            const memberData = await memberDatas(mem);
            return memberData;
          })
        }
        let replacementTrustee = {
          type: trust?.addTrust?.appointReplacementTrustee?.specifyOwnershipType,
          members: trust?.addTrust?.appointReplacementTrustee?.trustMembers?.map(async(mem) =>  {
            const memberData = await memberDatas(mem);
            return memberData;
          })
        }
        let trusteePowers = trust?.addTrust?.specifyTrusteePowers?.map(power => power?.isSelected ? power?.name : null)?.filter(power => power)
        return {
          trustDetails,
          primaryTrustee,
          replacementTrustee,
          trusteePowers
        }
      }
      else {
        throw new Error('no trust found');
      }
    } 
    catch(err){
      return err.message
    } 
  
  }

  module.exports = { createWillData }