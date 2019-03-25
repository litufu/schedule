/**
 * 每周四晚上12点执行。
 *思路：
 * 1、首先从数据库挑选出第一个城市里的所有用户
 * 2、对该城市的所有用户按照会员级别进行排序，得到一个用户列表
 * 3、从第一个用户开始计算匹配，匹配到计入数据库，并从列表中删除。
 * 4、该城市用户列表长度为0时停止
 * 5、将第一个用户所在城市从数据库中删除。挑选第二个用户所在城市，按照第一个城市算法计算。
 * 6、数据库长度为0时停止计算。
 * */
import "@babel/polyfill";
import { prisma } from '../generated/prisma-client'

const DateStartTime = new Date(2019,3,25)
const getTimeByTimeZone = (timeZone)=>{
    const d=new Date();
    const localTime = d.getTime()
    const localOffset=d.getTimezoneOffset()*60000
    const utc = localTime + localOffset
    const offset = timeZone
    const localSecondTime = utc + (3600000*offset) 
    const date = new Date(localSecondTime)
    return date
}
const birthdayToAge = (day)=>{
    const birthday = new Date(day)
    const d = new Date()
    const age = d.getFullYear()-birthday.getFullYear()-((d.getMonth()<birthday.getMonth()|| d.getMonth()===birthday.getMonth() && d.getDate()<birthday.getDate())?1:0);
    return age
  }




const now = getTimeByTimeZone(8)
const phase = parseInt(`${(now.getTime() - DateStartTime.getTime()) / 1000 / 60 / 60 / 24 / 7}`, 10) + 1
const match = async () => {
    const cities = await prisma.cities()
    for (const lovecity of cities) {
        // 1、找到该城市所有当期报名的人。
        const cityLoveSignUps = await prisma.loveSignUps({
            where: {
                AND: [
                    { city: { code: lovecity.code } },
                    { period: `${phase}` }
                ]
            }
        })
        // 2、对该城市的所有用户按照会员级别进行排序，得到一个用户列表
        const signUpPersons = []
        for (const citLoveSignUp of cityLoveSignUps) {
            const person = await prisma.loveSignUp({ id: citLoveSignUp.id }).person()
            const loveSetting = await prisma.loveSignUp({ id: citLoveSignUp.id }).person().loveSetting()
            // 计算会员等级
            let grade = loveSetting.memeberGrade
            // 如果会员等级为null，则grade为0
            if (!loveSetting.memeberGrade) {
                grade = 0
            }
            // 如果会员过期了，则grade为0
            if (loveSetting.memeberGradeEndTime) {
                if (new Date(loveSetting.memeberGradeEndTime) < new Date()) {
                    await prisma.updateLoveSetting({
                        where: { id: loveSetting.id },
                        data: {
                            memeberGrade: 0,
                            memeberGradeEndTime: null,
                        }
                    })
                    grade = 0
                }
            }

            const newPerson = {
                id: person.id,
                gender: person.gender,
                age: birthdayToAge(person.birthday),
                myHeight: loveSetting.myHeight,
                myWeight: loveSetting.myWeight,
                otherAgeMin: loveSetting.otherAgeMin,
                otherAgeMax: loveSetting.otherAgeMax,
                otherHeightMin: loveSetting.otherHeightMin,
                otherHeightMax: loveSetting.otherHeightMax,
                otherWeightMin: loveSetting.otherWeightMin,
                otherWeightMax: loveSetting.otherWeightMax,
                memeberGrade: grade
            }
            signUpPersons.push(newPerson)
        }
        // 报名者按照等级从高到低排序
        const sortedSignUpPersons = signUpPersons.sort((a, b) => b.memeberGrade - a.memeberGrade)
        // 3、从第一个用户开始计算匹配，匹配到计入数据库。
        const matchedPersons = []
        for (const person of sortedSignUpPersons) {
            for (const matcher of sortedSignUpPersons) {
                let womanId
                let manId
                if (person.gender === "male") {
                    manId = person.id
                    womanId = matcher.id
                } else {
                    manId = matcher.id
                    womanId = person.id
                }
                // 如果匹配成功
                if (
                    !~matchedPersons.indexOf(person.id) &&
                    !~matchedPersons.indexOf(matcher.id) &&
                    person.gender !== matcher.gender &&
                    person.age >= matcher.otherAgeMin &&
                    person.age <= matcher.otherAgeMax &&
                    person.myHeight <= matcher.otherHeightMax &&
                    person.myHeight >= matcher.otherHeightMin &&
                    person.myWeight <= matcher.otherWeightMax &&
                    person.myWeight >= matcher.otherWeightMin &&
                    matcher.age >= person.otherAgeMin &&
                    matcher.age <= person.otherAgeMax &&
                    matcher.myHeight >= person.otherHeightMin &&
                    matcher.myHeight <= person.otherHeightMax &&
                    matcher.myWeight >= person.otherWeightMin &&
                    matcher.myWeight <= person.otherWeightMax
                ) {
                    // 检查以前是否匹配成功过，匹配成功过的不再重复匹配
                    const pastLoveMatchings = await prisma.loveMatchings({
                        where:{
                            AND:[
                                {woman: {  id: womanId } },
                                {man:  { id: manId } }
                            ]
                        }
                    })
                    if(pastLoveMatchings.length===0){
                        matchedPersons.push(person.id)
                        matchedPersons.push(matcher.id)
                        await prisma.createLoveMatching({
                            period: `${phase}`,
                            city: { connect: { code: lovecity.code } },
                            woman: { connect: { id: womanId } },
                            man: { connect: { id: manId } }
                        })
                        break
                    }
                }
            }
            // 没有匹配成功,对象为null
            const personId = person.id
            if (!~matchedPersons.indexOf(person.id)) {
                matchedPersons.push(personId)
                if (person.gender === "male") {
                    await prisma.createLoveMatching({
                        period: `${phase}`,
                        city: { connect: { code: lovecity.code } },
                        man: { connect: { id: personId } }
                    })
                } else {
                    await prisma.createLoveMatching({
                        period: `${phase}`,
                        city: { connect: { code: lovecity.code } },
                        woman: { connect: { id: personId } },
                    })
                }
            }
        }
    }

}

console.log('match start...')
match()
console.log('match over!')

