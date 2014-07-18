mkdir -p /data/config/ /data/shard0/rs0 /data/shard0/rs1 /data/shard0/rs2 /data/shard1/rs0 /data/shard1/rs1 /data/shard1/rs2

# shard 0

mongod --replSet s0 --logpath "s0-0.log" --dbpath /data/shard0/rs0 --port 37017 --fork --shardsvr
mongod --replSet s0 --logpath "s0-1.log" --dbpath /data/shard0/rs1 --port 37018 --fork --shardsvr
mongod --replSet s0 --logpath "s0-2.log" --dbpath /data/shard0/rs2 --port 37019 --fork --shardsvr
						
mongo --port 37017 << 'EOF'
config = {
	_id: "s0", members: [
		{_id: 0, host: "127.0.0.1:37017"},
		{_id: 1, host: "127.0.0.1:37018"},
		{_id: 2, host: "127.0.0.1:37019"}
	]
};
rs.initiate(config)
EOF

# shard 1

mongod --replSet s1 --logpath "s1-0.log" --dbpath /data/shard1/rs0 --port 47017 --fork --shardsvr
mongod --replSet s1 --logpath "s1-1.log" --dbpath /data/shard1/rs1 --port 47018 --fork --shardsvr
mongod --replSet s1 --logpath "s1-2.log" --dbpath /data/shard1/rs2 --port 47019 --fork --shardsvr
						
mongo --port 37017 << 'EOF'
config = {
	_id: "s1", members: [
		{_id: 0, host: "127.0.0.1:47017"},
		{_id: 1, host: "127.0.0.1:47018"},
		{_id: 2, host: "127.0.0.1:47019"}
	]
};
rs.initiate(config)
EOF

# config servers

mongod --logpath "cfg-0.log" --dbpath /data/config/cfg0 --port 57017 --fork --configsvr
mongod --logpath "cfg-1.log" --dbpath /data/config/cfg1 --port 57018 --fork --configsvr
mongod --logpath "cfg-2.log" --dbpath /data/config/cfg2 --port 57019 --fork --configsvr

# start router and tell it where the config servers are
mongos --logpath "mongos-1.log" --configdb 127.0.0.1:57017,127.0.0.1:57018,127.0.0.1:57019 --fork

# add shards and enable sharding on the test db

mongo <<'EOF'
db.adminCommand( {addshard: "s0/127.0.0.1:37017"} );
db.adminCommand( {addshard: "s1/127.0.0.1:47017"} );
db.adminCommand( {enableSharding: "test"} );
db.adminCommand( {shardCollection: "test.grades", key: {student_id: 1}} );
EOF

# mongo shell talks to the mongos, mongos talks to the config servers and the 2 shards

