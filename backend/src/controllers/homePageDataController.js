import User from "../models/User.js";

const homePageData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const userId = req.userId;
    // console.log("home page data", userId);

    const filter = { isPublic: true, _id: { $ne: userId } }; // skip logged in user

    // If availability is provided, add it dynamically
    if (req.query.availability) {
      filter[`availability.${req.query.availability}`] = true;
    }

    const users = await User.find(filter)
      .select("name avatarUrl skillsOffered skillsWanted rating availability")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);

    res.json({
      Success: true,
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ Success: false, message: "Server error", error: err.message });
  }
};

const typedSearch = async (req, res) => {
  const { search } = req.query;

  try {
    if (!search || search.trim() === "") {
      // If no search term, return all users (or homepage data)
      const filter = {isPublic: true}
      const allUsers = await User.find(filter).select("name avatarUrl skillsOffered skillsWanted rating availability")
      return res.json({ Success: true, searchResult: allUsers });
    }

    const users = await User.find({
      isPublic: true,
      $or: [
        { name: { $regex: search, $options: "i" } }, // case-insensitive match
        { skillsWanted: { $regex: search, $options: "i" } }, // array of skills
        { skillsOffered: { $regex: search, $options: "i" } }, // array of skills
      ],
    }).select("name avatarUrl skillsOffered skillsWanted rating availability");

    // console.log(users)

    return res.json({ Success: true, searchResult: users });
  } catch (err) {
    res.status(500).json({ Success: false, error: err.message });
  }
};

const getProfileDataById = async (req, res) => {

  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-current_password -role -banned -rating").lean()
    return res.json({Success: true, message: "User found", user})
  
  } catch (error) {
    return res.json({Success: false, message: "User not found", error}) 
  }
}

export { homePageData, typedSearch, getProfileDataById };
