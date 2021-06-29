const express = require("express")
const app = express()
const port = 8000

const { Onfido, Region } = require("@onfido/api")

let onfido, webhook

const setupWebhook = async () => {
  onfido = new Onfido({
    apiToken: "api_sandbox.QF85laAIVkn.ic-BDik1ucFWjk0bA7lpLF7xbmLyiVBo",
    // Supports Region.EU, Region.US and Region.CA
    region: Region.EU,
  })

  webhook = await onfido.webhook.create({
    url: "https://webhook.site/819924e7-dee5-46b6-b520-78404ac44946",
    events: ["report.completed", "check.completed"],
  })
}

app.get("/createApplicant", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.set("Referrer-Policy", "no-referrer")
  const newApplicant = await onfido.applicant.create({
    firstName: "Jane",
    lastName: "Doe",
    dob: "1990-01-31",
    address: {
      postcode: "S2 2DF",
      country: "GBR",
    },
  })

  const applicantId = newApplicant.id
  console.log("id:", applicantId)
  const sdkToken = await onfido.sdkToken.generate({
    applicantId,
    referrer: "*",
  })
  res.end(sdkToken)
})
app.get("/", (req, res) => {
  res.end("hello")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  setupWebhook()
})
