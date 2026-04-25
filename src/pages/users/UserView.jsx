import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserForm } from './UserForm';
import { userService } from '../../services';

const UserView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchUser(id);
        }
    }, [id]);

    const fetchUser = async (userId) => {
        setIsLoading(true);
        try {
            const data = await userService.getUserById(userId);
            setUser(data.data);
        } catch (error) {
            console.error('Failed to fetch user', error);
            navigate('/users');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    if (!user) return null;

    return (
        <UserForm
            title="View User Details"
            initialData={user}
            isViewMode
            onSubmit={async () => { }}
        />
    );
};

export default UserView;
