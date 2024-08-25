const pool = require('../database/config'); // Assuming your database config is here
const ApiError = require('../utils/apiError');
const { findOneFormatter , findAllFormatter} = require('../utils/formatters/userFormatter');
// Find all users
exports.findAll = async (req, res, next) => {
    try {
        // Extract query parameters
        const { name, email, verified, limit = 10, page = 1,  startDate, endDate  } = req.query;
        const values = [];
        let index = 1;

        // Base query
        let query = `
            SELECT * FROM users WHERE 1=1
        `;

        // Filter by name
        if (name) {
            query += ` AND name ILIKE '%' || $${index++} || '%'`;
            values.push(name);
        }

        // Filter by email
        if (email) {
            query += ` AND email ILIKE '%' || $${index++} || '%'`;
            values.push(email);
        }

        // Filter by verification status
        if (verified !== undefined) {
            query += ` AND verified = $${index++}`;
            values.push(verified === 'true');
        }

        if (startDate) {
            query += ` AND created_at >= $${index++}`;
            values.push(startDate);
        }

        if (endDate) {
            query += ` AND created_at <= $${index++}`;
            values.push(endDate);
        }

         // Add pagination
         const offset = (page - 1) * limit;
         query += ` LIMIT $${index++} OFFSET $${index++}`;
         values.push(parseInt(limit), parseInt(offset));
       

        // Query to count verified users
        const verifiedQuery = `
            SELECT COUNT(*) FROM users WHERE verified = true;
        `;
        const allUsersQuery = `
            SELECT COUNT(*) FROM users;
        `;
        let [result, verifiedUsers, totalUsers] = await Promise.all([
            pool.query(query, values),
            pool.query(verifiedQuery),
            pool.query(allUsersQuery),
        ])

        verifiedUsers = parseInt(verifiedUsers.rows[0].count, 10);
        totalUsers = parseInt(totalUsers.rows[0].count, 10);


        // Return users and totals
        res.status(200).json({
            data: result.rows.map(user => findAllFormatter(user)),
            displayedUsers: result.rows.length,
            registeredUsers: totalUsers,
            verifiedUsers,

        });
    } catch (err) {
        console.error('Error fetching users', err.stack);
        res.status(500).json({ message: 'Server error' });
    }
};


// Find one user by ID
exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return next(new ApiError('User not found', 404));
    }



    res.status(200).json({ data: findOneFormatter(result.rows[0]) });
  } catch (err) {
    console.error('Error fetching user', err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user by ID
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  //to not update other users
    if(id != req.user.id){
        return next(new ApiError('Unauthorized access', 401));
    }

  try {
    let query = 'UPDATE users SET';
    const values = [];
    let index = 1;

    if (name) {
      query += ` name = $${index++},`;
      values.push(name);
    }
    if (email) {
      query += ` email = $${index++},`;
      values.push(email);
    }
    

    query = query.slice(0, -1); // Remove the last comma
    query += `, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return next(new ApiError('User not found', 404));
    }

    res.status(200).json({ data: findOneFormatter(result.rows[0]) });
  } catch (err) {
    console.error('Error updating user', err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user by ID
exports.deleteOne = async (req, res, next) => {
   

  const { id } = req.params;
  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return next(new ApiError('User not found', 404));
    }

    res.status(204).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user', err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.topThreeUsersByLoginFrequency = async (req, res, next) => {
    try {
        const query = `
            SELECT * FROM users
            ORDER BY number_of_logins DESC
            LIMIT 3;
        `;

        const result = await pool.query(query);

        res.status(200).json({
            data: result.rows.map(user => findAllFormatter(user))
        });
    } catch (err) {
        console.error('Error fetching top 3 users by login frequency', err.stack);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.listInactiveUsers = async (req, res, next) => {
    try {
        const { period, limit = 10, page = 1 } = req.query;

        let condition;
        if (period === 'hour') {
            condition = "last_login < NOW() - INTERVAL '1 hour'";
        } else if (period === 'month') {
            condition = "last_login < NOW() - INTERVAL '1 month'";
        } else {
            return res.status(400).json({ message: 'Invalid period. Use "hour" or "month".' });
        }

       
        let query = `
            SELECT * FROM users WHERE ${condition}
        `;

        // Add pagination
        const offset = (page - 1) * limit;
        query += ` LIMIT $1 OFFSET $2`;

        
        const values = [parseInt(limit), parseInt(offset)];

 
        const result = await pool.query(query, values);

      
        res.status(200).json({
            data: result.rows.map(user => findAllFormatter(user)),
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.rowCount / limit)
        });
    } catch (err) {
        console.error('Error fetching inactive users', err.stack);
        res.status(500).json({ message: 'Server error' });
    }
};


