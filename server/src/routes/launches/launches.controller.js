const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const pagination = getPagination(req.query);

  res.status(200).json(await getAllLaunches(pagination));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await addNewLaunch(launch);
  res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  if (!(await existsLaunchWithId(launchId))) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (aborted.modifiedCount === 0) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
